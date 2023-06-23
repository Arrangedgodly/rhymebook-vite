import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  writeBatch
} from "firebase/firestore";

interface NotesProps {
  currentUser: any;
}

interface Note {
  id: string;
  title: string;
  lyrics: string;
  isPinned?: boolean;
}

const useNotesLogic = ({ currentUser }: NotesProps) => {
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeNote, setActiveNote] = useState<any>(null);
  const navigate = useNavigate();
  const db = getFirestore();

  /**
   * This function retrieves notes data from a Firestore collection, separates pinned and unpinned
   * notes, and sets the state of the component accordingly.
   */
  const getNotes = async () => {
    const notesCollection = collection(db, "users", currentUser.uid, "notes");
    const notesSnapshot = await getDocs(notesCollection);
    const notesData = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      lyrics: doc.data().lyrics,
      isPinned: doc.data().isPinned,
      ...doc.data(),
    }));

    const pinned = notesData.filter((note: Note) => note.isPinned);
    const unpinned = notesData.filter((note: Note) => !note.isPinned);

    setPinnedNotes(pinned);
    setNotes(unpinned);
  };

  /**
   * This function adds a new note with a default title and empty lyrics to a Firestore collection if
   * there are no existing notes with the same title and lyrics.
   * @returns If the `querySnapshot` is not empty, the function will return nothing (`undefined`). If
   * the `querySnapshot` is empty, the function will add a new note to the Firestore database and
   * update the state of the `notes` array by adding the new note at the beginning.
   */
  const addBlankNote = async () => {
    const notesCollection = collection(db, "users", currentUser.uid, "notes");
    const untitledQuery = query(
      notesCollection,
      where("title", "==", "Untitled"),
      where("lyrics", "==", "")
    );
    const querySnapshot = await getDocs(untitledQuery);
    if (!querySnapshot.empty) return;
    const newNote = {
      title: "Untitled",
      lyrics: "",
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    };
    const docRef = await addDoc(notesCollection, newNote);
    const newNoteWithId = {
      id: docRef.id,
      ...newNote,
    };
    setNotes([newNoteWithId, ...notes]);
  };

  /**
   * This function toggles the "isPinned" property of a note and moves it between the "pinnedNotes" and
   * "notes" arrays.
   * @param {string} noteId - a string representing the unique identifier of a note.
   * @param {boolean} isPinned - A boolean value indicating whether the note is currently pinned or
   * not.
   */
  const handlePinClick = async (noteId: string, isPinned: boolean) => {
    const noteRef = doc(db, "users", currentUser.uid, "notes", noteId);
    await updateDoc(noteRef, { isPinned: !isPinned });
    if (isPinned) {
      const note = pinnedNotes.find((note: Note) => note.id === noteId);
      if (note) {
        setPinnedNotes(pinnedNotes.filter((note: Note) => note.id !== noteId));
        setNotes([...notes, { ...note, isPinned: false }]);
      }
    } else {
      const note = notes.find((note: Note) => note.id === noteId);
      if (note) {
        setNotes(notes.filter((note: Note) => note.id !== noteId));
        setPinnedNotes([...pinnedNotes, { ...note, isPinned: true }]);
      }
    }
  };

  /**
   * This function saves a note to a user's collection in a Firestore database, either by updating an
   * existing note or creating a new one.
   * @param {Note} updatedNote - The updated version of a note object that needs to be saved.
   * @param {string} noteId - The ID of the note being updated. If it is null or undefined, a new note
   * will be created.
   * @returns If `noteId` is not provided, the function returns the ID of the newly created note. If
   * `noteId` is provided, the function does not return anything (`undefined`).
   */
  const handleNoteSave = async (updatedNote: Note, noteId: string) => {
    const defaults = {
      isPinned: false,
    };

    const note = {
      ...updatedNote,
      ...defaults,
      lastEditedAt: serverTimestamp(),
    };
    
    const userNotesCollection = collection(db, "users", currentUser.uid, "notes");
    
    if (noteId) {
      await updateDoc(doc(userNotesCollection, noteId), note);
      setNotes(notes.map((note: Note) => (note.id === noteId ? { ...note, ...updatedNote } : note)));
    } else {
      const noteRef = await addDoc(userNotesCollection, note);
      return noteRef.id;
    }
  };


  /**
   * This function handles the selection and deselection of notes by adding or removing their IDs from
   * an array.
   * @param {string} noteId - a string representing the ID of a note that is being selected or
   * deselected.
   */
  const handleSelectedNotes = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  /**
   * This function deletes a note from a user's collection and updates the state of the notes and
   * pinnedNotes arrays.
   * @param {string} noteId - The `noteId` parameter is a string that represents the unique identifier
   * of a note that needs to be deleted. This function uses the `noteId` to locate the specific note
   * document in the Firestore database and delete it.
   */
  const deleteNote = async (noteId: string) => {
    const noteRef = doc(db, "users", currentUser.uid, "notes", noteId);
    await deleteDoc(noteRef);

    setNotes(notes.filter((note: Note) => note.id !== noteId));
    setPinnedNotes(pinnedNotes.filter((note) => note.id !== noteId));
  };

  /**
   * This function deletes multiple notes from a Firestore database using a batch write.
   * @param {string[]} notes - an array of strings representing the IDs of the notes to be deleted.
   */
  const deleteNotes = async (notes: string[]) => {
    const batch = writeBatch(db);
    notes.forEach((noteId) => {
      const noteRef = doc(db, "users", currentUser.uid, "notes", noteId);
      batch.delete(noteRef);
    });
    await batch.commit();
    setSelectedNotes([]);
  }

  /* This `useEffect` hook is responsible for fetching the notes data from Firestore and setting the
  state of the component when the `currentUser` prop changes. If `currentUser` is falsy (i.e. not
  logged in), the user is redirected to the home page. If `currentUser` is truthy, the `getNotes`
  function is called to retrieve the notes data from Firestore and set the state of the component
  accordingly. The `useEffect` hook is dependent on the `currentUser` prop, so it will only run when
  `currentUser` changes. */
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else {
      getNotes();
    }
  }, [currentUser]);

  return {
    notes,
    pinnedNotes,
    activeTab,
    setActiveTab,
    addBlankNote,
    activeNote,
    setActiveNote,
    handlePinClick,
    handleNoteSave,
    deleteNote,
    deleteNotes,
    handleSelectedNotes,
    selectedNotes,
  };
};

export default useNotesLogic;
