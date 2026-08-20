import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import type { AppUser } from "../types/user";
import type { FollowCounts, PublicProfile } from "../types/profile";

/** Email addresses are cased inconsistently; the index keys on a normalised form. */
export function emailKey(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Publish (or refresh) the parts of an account other people are allowed to see,
 * plus the address -> uid entry that lets someone share a note with them.
 *
 * Safe to call on every sign-in: both writes are idempotent.
 */
export async function publishProfile(user: AppUser): Promise<void> {
  const db = getFirestore();
  const profile: PublicProfile = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  const batch = writeBatch(db);
  batch.set(doc(db, "publicProfiles", user.uid), profile, { merge: true });
  if (user.email) {
    batch.set(doc(db, "emailIndex", emailKey(user.email)), {
      uid: user.uid,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export async function getProfile(uid: string): Promise<PublicProfile | null> {
  const snap = await getDoc(doc(getFirestore(), "publicProfiles", uid));
  return snap.exists() ? (snap.data() as PublicProfile) : null;
}

/** Resolve an email address to a uid, or null when nobody uses it. */
export async function findUidByEmail(email: string): Promise<string | null> {
  const key = emailKey(email);
  if (!key) return null;
  const snap = await getDoc(doc(getFirestore(), "emailIndex", key));
  return snap.exists() ? (snap.data().uid as string) : null;
}

/**
 * Follow someone.
 *
 * Two documents, because each side of the relationship is owned by a different
 * user and the rules only let each of them write their own edge.
 */
export async function followUser(me: string, them: string): Promise<void> {
  if (me === them) return;
  const db = getFirestore();
  const batch = writeBatch(db);
  batch.set(doc(db, "publicProfiles", me, "following", them), {
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "publicProfiles", them, "followers", me), {
    createdAt: serverTimestamp(),
  });
  await batch.commit();
}

export async function unfollowUser(me: string, them: string): Promise<void> {
  const db = getFirestore();
  await Promise.all([
    deleteDoc(doc(db, "publicProfiles", me, "following", them)),
    deleteDoc(doc(db, "publicProfiles", them, "followers", me)),
  ]);
}

export async function isFollowing(me: string, them: string): Promise<boolean> {
  const snap = await getDoc(
    doc(getFirestore(), "publicProfiles", me, "following", them)
  );
  return snap.exists();
}

/** Counted server-side so a popular account doesn't download its whole follower list. */
export async function getFollowCounts(uid: string): Promise<FollowCounts> {
  const db = getFirestore();
  const [followers, following] = await Promise.all([
    getCountFromServer(collection(db, "publicProfiles", uid, "followers")),
    getCountFromServer(collection(db, "publicProfiles", uid, "following")),
  ]);
  return {
    followers: followers.data().count,
    following: following.data().count,
  };
}

/** Remove the public traces of an account. Used by the delete-account flow. */
export async function removeProfile(user: AppUser): Promise<void> {
  const db = getFirestore();
  const batch = writeBatch(db);
  batch.delete(doc(db, "publicProfiles", user.uid));
  if (user.email) batch.delete(doc(db, "emailIndex", emailKey(user.email)));
  await batch.commit();
}
