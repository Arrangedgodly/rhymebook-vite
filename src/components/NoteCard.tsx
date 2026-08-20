import { useNavigate } from "react-router-dom";
import { MdPushPin, MdOutlinePushPin } from "react-icons/md";
import type { Note } from "../types/note";
import type { PublicProfile } from "../types/profile";

interface NoteCardProps {
  note: Note;
  /** Shared notes are read-mostly: no pin, share or delete for a collaborator. */
  owned: boolean;
  onTogglePin: (noteId: string, isPinned: boolean) => void;
  onManage: (note: Note) => void;
  onDelete: (note: Note) => void;
  /** Only set for shared notes: whoever owns the note. */
  owner?: PublicProfile;
}

function excerpt(lyrics: string): string {
  const trimmed = lyrics.trim();
  if (!trimmed) return "Empty so far.";
  return trimmed.length > 160 ? `${trimmed.slice(0, 160)}...` : trimmed;
}

const NoteCard = ({
  note,
  owned,
  onTogglePin,
  onManage,
  onDelete,
  owner,
}: NoteCardProps) => {
  const navigate = useNavigate();
  const shareCount = note.sharedWith?.length ?? 0;

  return (
    <article
      className="group relative flex h-full flex-col rounded-lg border border-base-300
                 bg-base-100 p-4 transition hover:border-primary/60"
    >
      {/* The whole card is a target for opening the note; the buttons sit above it. */}
      <button
        type="button"
        className="absolute inset-0 rounded-lg focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={`Open ${note.title || "Untitled"}`}
        onClick={() => navigate(`/notes/${note.id}`)}
      />

      <div className="relative flex items-start gap-2">
        <h3 className="min-w-0 flex-1 truncate font-semibold">
          {note.title || "Untitled"}
        </h3>
        {owned && (
          <button
            type="button"
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
            className="relative shrink-0 opacity-60 hover:opacity-100"
            onClick={() => onTogglePin(note.id, note.isPinned ?? false)}
          >
            {note.isPinned ? (
              <MdPushPin className="h-4 w-4 text-primary" />
            ) : (
              <MdOutlinePushPin className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <p className="pointer-events-none mt-2 line-clamp-4 flex-1 whitespace-pre-wrap text-sm opacity-70">
        {excerpt(note.lyrics ?? "")}
      </p>

      {(note.tags?.length ?? 0) > 0 && (
        <div className="pointer-events-none relative mt-3 flex flex-wrap gap-1">
          {note.tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-base-300 px-2 py-0.5 text-[0.68rem] opacity-70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-3 flex items-center gap-2 border-t border-base-300 pt-2">
        {owned ? (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => onManage(note)}
            >
              Tags &amp; sharing
              {shareCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[0.65rem] tabular-nums">
                  {shareCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs ml-auto text-error"
              onClick={() => onDelete(note)}
            >
              Delete
            </button>
          </>
        ) : owner ? (
          <span className="text-xs opacity-55">
            Shared by{" "}
            <button
              type="button"
              className="relative underline underline-offset-2 hover:opacity-100"
              onClick={() => navigate(`/profile/${owner.uid}`)}
            >
              {owner.displayName || "a RhymePage user"}
            </button>
          </span>
        ) : (
          <span className="text-xs opacity-55">Shared with you</span>
        )}
      </div>
    </article>
  );
};

export default NoteCard;
