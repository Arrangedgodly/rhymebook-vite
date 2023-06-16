import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";

interface NotesProps {
  currentUser: any;
}

const useNotesLogic = ({ currentUser }: NotesProps) => {
  const [notes, setNotes] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>("notebook");
  const navigate = useNavigate();
  const db = getFirestore();

  const getNotes = async () => {
    const notesCollection = collection(db, "users", currentUser.uid, "notes");
    const notesSnapshot = await getDocs(notesCollection);
    const notesData = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesData);
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
    setNotes([...notes, newNoteWithId]);
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
  };
};

export default useNotesLogic;
