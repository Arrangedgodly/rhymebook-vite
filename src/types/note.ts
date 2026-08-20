import type { FieldValue, Timestamp } from "firebase/firestore";

/** A saved lyric note. */
export interface Note {
  id: string;
  title: string;
  lyrics: string;
  userId: string;
  themes?: string;
  isPinned?: boolean;
  /** Free-form labels for filtering the notebook. */
  tags?: string[];
  /** uids this note has been shared with; they may edit the words, not the sharing. */
  sharedWith?: string[];
  /** `FieldValue` while a write is in flight, `Timestamp` once read back. */
  createdAt?: Timestamp | FieldValue;
  lastEditedAt?: Timestamp | FieldValue;
}
