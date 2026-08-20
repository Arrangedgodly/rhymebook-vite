/**
 * The signed-in user as the app actually holds it.
 *
 * This is not a live Firebase `User`: it is rehydrated from localStorage on
 * boot, so only the plain serialisable fields survive. Typing it honestly
 * keeps callers from reaching for methods that aren't there.
 */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

import type { User } from "firebase/auth";

/** Narrow a live Firebase user down to the fields the app actually stores. */
export function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}
