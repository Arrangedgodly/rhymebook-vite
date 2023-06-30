import { useState, useEffect, KeyboardEvent } from "react";
import {
  getRhyme,
  getSoundAlike,
  getRelatedAdjectives,
  getRelatedNouns,
  getRelatedWords,
  getSynonyms,
  getAntonyms,
  getFrequentFollowers,
} from "../utils/rhymeApi";
import { Timestamp, getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  updateDoc,
  addDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

interface DashboardProps {
  currentUser: any;
  existingNoteId?: string;
}

const useDashboardLogic = ({ currentUser, existingNoteId }: DashboardProps) => {
  const [title, setTitle] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [themes, setThemes] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<Timestamp>();
  const [lastWord, setLastWord] = useState<string>("");
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [soundAlikes, setSoundAlikes] = useState<string[]>([]);
  const [nouns, setNouns] = useState<string[]>([]);
  const [adjectives, setAdjectives] = useState<string[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [antonyms, setAntonyms] = useState<string[]>([]);
  const [frequentFollowers, setFrequentFollowers] = useState<string[]>([]);
  const [relatedWords, setRelatedWords] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<any>({});
  const [noteId, setNoteId] = useState<string>(existingNoteId || "");
  const db = getFirestore();

  const handleSave = async () => {
    const note = {
      userId: currentUser.uid,
      title,
      lyrics,
      themes: themes || "",
      isPinned: isPinned || false,
      createdAt: createdAt || serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    };
    
    const notesCollection = collection(db, "notes");
    if (noteId) {
      await updateDoc(doc(notesCollection, noteId), note);
    } else {
      const noteRef = await addDoc(notesCollection, note);
      if (noteRef) {
        setNoteId(noteRef.id);
      }
    }
  };

  const handleReset = () => {
    setNoteId("");
    setTitle("");
    setLyrics("");
    setThemes("");
    setLastWord("");
    setRhymes([]);
    setSoundAlikes([]);
    setNouns([]);
    setAdjectives([]);
    setSynonyms([]);
    setAntonyms([]);
    setFrequentFollowers([]);
    setRelatedWords([]);
    setDefinitions({});
  };

  const getLastWord = (str: string) => {
    const words = str.split(" ");
    return words[words.length - 1];
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === " " || e.key === "Enter") {
      setLastWord(getLastWord(lyrics));
    }
  };

  const handleLeftClick = (word: string) => {
    setLyrics(lyrics + word + " ");
    setLastWord(word);
  };

  const getRhymes = async () => {
    const res = await getRhyme(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setRhymes(values);
  };

  const getSoundAlikes = async () => {
    const res = await getSoundAlike(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setSoundAlikes(values);
  };

  const getNouns = async () => {
    const res = await getRelatedNouns(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setNouns(values);
  };

  const getAdjs = async () => {
    const res = await getRelatedAdjectives(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setAdjectives(values);
  };

  const getSyns = async () => {
    const res = await getSynonyms(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setSynonyms(values);
  };

  const getAnts = async () => {
    const res = await getAntonyms(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setAntonyms(values);
  };

  const getFreqFollowers = async () => {
    const res = await getFrequentFollowers(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setFrequentFollowers(values);
  };

  const getRelWords = async () => {
    const res = await getRelatedWords(lastWord, "topic", themes, 50);
    const values = [];
    for (let i = 0; i < res.length; i++) {
      values.push(res[i].word);
    }
    setRelatedWords(values);
  };

  useEffect(() => {
    getRhymes();
    getSoundAlikes();
    getNouns();
    getAdjs();
    getSyns();
    getAnts();
    getFreqFollowers();
    getRelWords();
  }, [lastWord]);

  useEffect(() => {
    const fetchNoteData = async () => {
      if (existingNoteId && existingNoteId !== "") {
        const noteRef = doc(db, "notes", existingNoteId);
        const noteData = await getDoc(noteRef);
        if (noteData.exists()) {
          const note = noteData.data();
          setTitle(note.title);
          setLyrics(note.lyrics);
          setThemes(note.themes || "");
          setIsPinned(note.isPinned);
          setCreatedAt(note.createdAt);
          setLastWord(getLastWord(note.lyrics));
        }
      } else {
        handleReset();
      }
    };
    fetchNoteData();
  }, [existingNoteId]);

  useEffect(() => {
    const autoSave = async () => {
      if (noteId) {
        const note = {
          userId: currentUser.uid,
          title,
          lyrics,
          themes: themes || "",
          isPinned: isPinned || false,
          createdAt: createdAt || serverTimestamp(),
          lastEditedAt: serverTimestamp(),
        };        
        const notesCollection = collection(db, "notes");
        await updateDoc(doc(notesCollection, noteId), note);
      }
    };
  
    const saveTimer = setTimeout(autoSave, 2000);
  
    return () => clearTimeout(saveTimer);
  }, [title, lyrics, themes, noteId]);

  return {
    title,
    setTitle,
    lyrics,
    setLyrics,
    themes,
    setThemes,
    rhymes,
    soundAlikes,
    nouns,
    adjectives,
    synonyms,
    antonyms,
    frequentFollowers,
    relatedWords,
    handleSave,
    handleReset,
    handleLeftClick,
    setDefinitions,
    definitions,
    handleKeyDown,
  };
};

export default useDashboardLogic;
