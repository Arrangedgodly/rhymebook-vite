import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getCountFromServer, getFirestore, query, where } from "firebase/firestore";
import {
  followUser,
  getFollowCounts,
  getProfile,
  isFollowing,
  unfollowUser,
} from "../utils/profiles";
import Loading from "./Loading";
import type { FollowCounts, PublicProfile } from "../types/profile";
import type { AppUser } from "../types/user";

interface ProfileProps {
  currentUser: AppUser | null;
}

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="flex flex-col items-center rounded-lg border border-base-300 px-4 py-3">
    <span className="text-xl font-semibold tabular-nums">{value}</span>
    <span className="text-[0.68rem] uppercase tracking-wider opacity-55">
      {label}
    </span>
  </div>
);

function initials(name: string | null): string {
  const parts = (name ?? "").match(/\b\w/g) ?? [];
  return ((parts.shift() ?? "") + (parts.pop() ?? "")).toUpperCase() || "?";
}

const Profile = ({ currentUser }: ProfileProps) => {
  const { uid: routeUid } = useParams<{ uid?: string }>();
  const navigate = useNavigate();

  const viewingUid = routeUid ?? currentUser?.uid ?? null;
  const isSelf = Boolean(viewingUid && viewingUid === currentUser?.uid);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [counts, setCounts] = useState<FollowCounts>({
    followers: 0,
    following: 0,
  });
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Which profile is currently in state; anything else means still loading. */
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    if (!viewingUid) return;

    let cancelled = false;

    (async () => {
      try {
        const [found, followCounts] = await Promise.all([
          getProfile(viewingUid),
          getFollowCounts(viewingUid),
        ]);
        if (cancelled) return;

        setProfile(
          found ??
            (viewingUid === currentUser.uid
              ? {
                  uid: currentUser.uid,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                }
              : null)
        );
        setMissing(!found && viewingUid !== currentUser.uid);
        setCounts(followCounts);

        // Only your own notes are readable, so only count them for yourself.
        if (viewingUid === currentUser.uid) {
          const snap = await getCountFromServer(
            query(
              collection(getFirestore(), "notes"),
              where("userId", "==", currentUser.uid)
            )
          );
          if (!cancelled) setNoteCount(snap.data().count);
        } else {
          const already = await isFollowing(currentUser.uid, viewingUid);
          if (!cancelled) setFollowing(already);
        }
      } catch {
        if (!cancelled) setMissing(true);
      } finally {
        if (!cancelled) setLoadedFor(viewingUid);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser, viewingUid, navigate]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser || !viewingUid) return;
    setBusy(true);
    const wasFollowing = following;
    // Optimistic: the counts should move the instant the button is pressed.
    setFollowing(!wasFollowing);
    setCounts((c) => ({
      ...c,
      followers: c.followers + (wasFollowing ? -1 : 1),
    }));
    try {
      if (wasFollowing) await unfollowUser(currentUser.uid, viewingUid);
      else await followUser(currentUser.uid, viewingUid);
    } catch {
      setFollowing(wasFollowing);
      setCounts((c) => ({
        ...c,
        followers: c.followers + (wasFollowing ? 1 : -1),
      }));
    } finally {
      setBusy(false);
    }
  }, [currentUser, viewingUid, following]);

  const loading = loadedFor !== viewingUid;

  if (!currentUser) return null;
  if (loading) return <Loading />;

  if (missing || !profile) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12 text-center">
        <h1 className="text-xl font-semibold">No such profile</h1>
        <p className="mt-2 text-sm opacity-65">
          That account does not exist, or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-base-300">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold opacity-70">
              {initials(profile.displayName)}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-xl font-bold">
          {profile.displayName || "A RhymePage user"}
        </h1>
        {isSelf && currentUser.email && (
          <p className="mt-0.5 text-sm opacity-60">{currentUser.email}</p>
        )}

        {isSelf ? (
          <button
            type="button"
            className="btn btn-outline btn-sm mt-4"
            onClick={() => navigate("/settings")}
          >
            Edit profile
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-sm mt-4 ${following ? "btn-outline" : "btn-primary"}`}
            disabled={busy}
            onClick={toggleFollow}
          >
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        <Stat label="Followers" value={counts.followers} />
        <Stat label="Following" value={counts.following} />
        <Stat label="Notes" value={noteCount ?? "-"} />
      </div>

      {!isSelf && (
        <p className="mt-4 text-center text-xs opacity-55">
          Note counts stay private unless a note is shared with you.
        </p>
      )}
    </div>
  );
};

export default Profile;
