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
  const [activeTab, setActiveTab] = useState<string>("notebook");
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
  };
};

export default useNotesLogic;
