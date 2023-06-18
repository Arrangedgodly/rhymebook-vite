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
  deleteDoc
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

  const handleSelectedNotes = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  }

  const deleteNote = async (noteId: string) => {
    const noteRef = doc(db, "users", currentUser.uid, "notes", noteId);
    await deleteDoc(noteRef);

    setNotes(notes.filter((note: Note) => note.id !== noteId));
    setPinnedNotes(pinnedNotes.filter((note) => note.id !== noteId));
  };

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
    deleteNote,
    handleSelectedNotes,
    selectedNotes
  };
};

export default useNotesLogic;
