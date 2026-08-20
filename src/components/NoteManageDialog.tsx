import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getProfile } from "../utils/profiles";
import { normalizeTag } from "../utils/notesApi";
import { Field, FormMessage, fieldInput } from "./FormControls";
import type { Note } from "../types/note";
import type { PublicProfile } from "../types/profile";
import type { ShareResult } from "../hooks/useNotesLogic";

interface NoteManageDialogProps {
  note: Note;
  suggestedTags: string[];
  onClose: () => void;
  onUpdateTags: (noteId: string, tags: string[]) => Promise<void>;
  onShare: (noteId: string, email: string) => Promise<ShareResult>;
  onRemoveCollaborator: (noteId: string, uid: string) => Promise<void>;
}

const NoteManageDialog = ({
  note,
  suggestedTags,
  onClose,
  onUpdateTags,
  onShare,
  onRemoveCollaborator,
}: NoteManageDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [email, setEmail] = useState("");
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);
  const [sharing, setSharing] = useState(false);
  const [collaborators, setCollaborators] = useState<PublicProfile[]>([]);

  const sharedWith = note.sharedWith ?? [];

  // Native <dialog> gives focus trapping and Escape handling for free.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await Promise.all(sharedWith.map((uid) => getProfile(uid)));
      if (cancelled) return;
      setCollaborators(
        found.filter((p): p is PublicProfile => p !== null)
      );
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedWith.join(",")]);

  const commitTags = useCallback(
    async (next: string[]) => {
      setTags(next);
      await onUpdateTags(note.id, next);
    },
    [note.id, onUpdateTags]
  );

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw);
    if (!tag || tags.includes(tag)) {
      setTagDraft("");
      return;
    }
    commitTags([...tags, tag]);
    setTagDraft("");
  };

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft && tags.length) {
      commitTags(tags.slice(0, -1));
    }
  };

  const handleShare = async () => {
    setSharing(true);
    const result = await onShare(note.id, email);
    setShareResult(result);
    if (result.ok) setEmail("");
    setSharing(false);
  };

  const unusedSuggestions = suggestedTags.filter((t) => !tags.includes(t));

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-lg border border-base-300
                 bg-base-100 p-0 text-base-content backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
        <h2 className="truncate text-base font-semibold">
          {note.title || "Untitled"}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={() => dialogRef.current?.close()}
        >
          Close
        </button>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4">
        {/* ---- tags ---- */}
        <section>
          <h3 className="text-[0.68rem] font-medium uppercase tracking-wider opacity-55">
            Tags
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.length === 0 && (
              <p className="text-sm opacity-55">No tags yet.</p>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-base-300 px-2 py-0.5 text-xs"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  className="opacity-50 hover:opacity-100"
                  onClick={() => commitTags(tags.filter((t) => t !== tag))}
                >
                  &#10005;
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            aria-label="Add a tag"
            placeholder="Add a tag, then press Enter"
            className={`${fieldInput} mt-2`}
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={() => tagDraft && addTag(tagDraft)}
          />
          {unusedSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs opacity-55">Used elsewhere:</span>
              {unusedSuggestions.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-full border border-dashed border-base-300 px-2 py-0.5 text-xs opacity-70 hover:opacity-100"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ---- sharing ---- */}
        <section>
          <h3 className="text-[0.68rem] font-medium uppercase tracking-wider opacity-55">
            Shared with
          </h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {collaborators.length === 0 && (
              <li className="text-sm opacity-55">Nobody else yet.</li>
            )}
            {collaborators.map((person) => (
              <li
                key={person.uid}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="truncate">
                  {person.displayName || "A RhymePage user"}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => onRemoveCollaborator(note.id, person.uid)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <Field
              label="Invite by email"
              htmlFor="share-email"
              hint="They can edit the words, but not the sharing or who owns it."
            >
              <input
                id="share-email"
                type="email"
                className={fieldInput}
                placeholder="them@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShareResult(null);
                }}
              />
            </Field>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={sharing || !email.trim()}
                onClick={handleShare}
              >
                {sharing ? "Sharing..." : "Share"}
              </button>
              {shareResult && (
                <FormMessage tone={shareResult.ok ? "success" : "error"}>
                  {shareResult.message}
                </FormMessage>
              )}
            </div>
          </div>
        </section>
      </div>
    </dialog>
  );
};

export default NoteManageDialog;
