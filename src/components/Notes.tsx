import { useState } from "react";
import useNotesLogic from "../hooks/useNotesLogic";
import NoteCard from "./NoteCard";
import NoteManageDialog from "./NoteManageDialog";
import ConfirmDialog from "./ConfirmDialog";
import Loading from "./Loading";
import type { Note } from "../types/note";
import type { AppUser } from "../types/user";

interface NotesProps {
  currentUser: AppUser | null;
}

const Notes = ({ currentUser }: NotesProps) => {
  const {
    ownNotes,
    sharedNotes,
    owners,
    visibleNotes,
    allTags,
    loading,
    tab,
    setTab,
    tagFilter,
    setTagFilter,
    createNote,
    togglePin,
    deleteNote,
    updateTags,
    shareWithEmail,
    removeCollaborator,
  } = useNotesLogic({ currentUser });

  const [managing, setManaging] = useState<Note | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  if (!currentUser) return null;

  const tabs = [
    { id: "mine" as const, label: "My notes", count: ownNotes.length },
    { id: "shared" as const, label: "Shared with me", count: sharedNotes.length },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">Notebook</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={createNote}>
          New note
        </button>
      </div>

      <div role="tablist" className="mt-5 flex gap-1 border-b border-base-300">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setTagFilter(null);
            }}
            className={[
              "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              tab === id
                ? "border-primary text-primary"
                : "border-transparent opacity-60 hover:opacity-100",
            ].join(" ")}
          >
            {label}
            <span className="text-[0.7rem] tabular-nums opacity-70">{count}</span>
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[0.68rem] font-medium uppercase tracking-wider opacity-55">
            Tags
          </span>
          <button
            type="button"
            onClick={() => setTagFilter(null)}
            className={[
              "rounded-full border px-2.5 py-0.5 text-xs transition",
              tagFilter === null
                ? "border-primary bg-primary text-primary-content"
                : "border-base-300 opacity-70 hover:opacity-100",
            ].join(" ")}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={[
                "rounded-full border px-2.5 py-0.5 text-xs transition",
                tagFilter === tag
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : visibleNotes.length === 0 ? (
        <p className="mt-10 text-center text-sm opacity-60">
          {tab === "shared"
            ? "Nothing has been shared with you yet."
            : tagFilter
              ? `No notes tagged "${tagFilter}".`
              : "No notes yet. Start one and it'll show up here."}
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              owned={tab === "mine"}
              onTogglePin={togglePin}
              onManage={setManaging}
              onDelete={setPendingDelete}
              owner={tab === "shared" ? owners[note.userId] : undefined}
            />
          ))}
        </div>
      )}

      {managing && (
        <NoteManageDialog
          note={ownNotes.find((n) => n.id === managing.id) ?? managing}
          suggestedTags={allTags}
          onClose={() => setManaging(null)}
          onUpdateTags={updateTags}
          onShare={shareWithEmail}
          onRemoveCollaborator={removeCollaborator}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete "${pendingDelete.title || "Untitled"}"?`}
          body="The note and its lyrics go for good. This cannot be undone."
          confirmLabel="Delete note"
          onCancel={() => setPendingDelete(null)}
          onConfirm={async () => {
            await deleteNote(pendingDelete.id);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Notes;
