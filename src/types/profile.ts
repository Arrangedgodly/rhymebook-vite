/**
 * The public face of an account.
 *
 * Deliberately holds no email address: this document is readable by every
 * signed-in user so people can be found and followed, and an email in here
 * would be an email anyone could scrape. Address lookup goes through the
 * `emailIndex` collection instead, which permits `get` but not `list`.
 */
export interface PublicProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface FollowCounts {
  followers: number;
  following: number;
}
