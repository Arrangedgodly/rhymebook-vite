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
  orderBy,
  serverTimestamp,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

interface NotesProps {
  currentUser: any;
}

interface Note {
  id: string;
  title: string;
  lyrics: string;
  isPinned?: boolean;
  userId: string;
}

const useNotesLogic = ({ currentUser }: NotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [activeNote, setActiveNote] = useState<any>(null);
  const navigate = useNavigate();
  const db = getFirestore();

  const getNotes = async () => {
    const notesCollection = collection(db, "notes");
    const notesQuery = query(notesCollection, where("userId", "==", currentUser.uid), orderBy("lastEditedAt", "desc"));
    const notesSnapshot = await getDocs(notesQuery);
    const notesData = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      lyrics: doc.data().lyrics,
      userId: doc.data().userId,
      ...doc.data(),
    }));

    setNotes(notesData);
  };

  const addBlankNote = async () => {
    const notesCollection = collection(db, "notes");
    const untitledQuery = query(
      notesCollection,
      where("title", "==", "Untitled"),
      where("lyrics", "==", ""),
      where("userId", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(untitledQuery);
    if (!querySnapshot.empty) return;

    const newNote = {
      title: "Untitled",
      lyrics: "",
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
      userId: currentUser.uid,
    };
    const docRef = await addDoc(notesCollection, newNote);
    const newNoteWithId = {
      id: docRef.id,
      ...newNote,
    };
    setNotes([newNoteWithId, ...notes]);
  };

  const handlePinClick = async (noteId: string, isPinned: boolean) => {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, { isPinned: !isPinned });
    setNotes(
      notes.map((note: Note) =>
        note.id === noteId ? { ...note, isPinned: !isPinned } : note
      )
    );
  };

  const handleNoteSave = async (updatedNote: Note, noteId: string) => {
    const defaults = {
      isPinned: false,
    };

    const note = {
      ...updatedNote,
      ...defaults,
      lastEditedAt: serverTimestamp(),
    };

    const notesCollection = collection(db, "notes");

    if (noteId) {
      const noteRef = doc(notesCollection, noteId);
      await updateDoc(noteRef, note);
      setNotes(
        notes.map((note: Note) =>
          note.id === noteId ? { ...note, ...updatedNote } : note
        )
      );
    } else {
      const noteRef = await addDoc(notesCollection, note);
      return noteRef.id;
    }
  };

  const handleSelectedNotes = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const deleteNote = async (noteId: string) => {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
    setNotes(notes.filter((note: Note) => note.id !== noteId));
  };

  const deleteNotes = async (notes: string[]) => {
    const batch = writeBatch(db);
    notes.forEach((noteId) => {
      const noteRef = doc(db, "notes", noteId);
      batch.delete(noteRef);
    });
    await batch.commit();
    setSelectedNotes([]);
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
