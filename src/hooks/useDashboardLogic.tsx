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

  /**
   * This function saves a note to a Firestore database, either by updating an existing note or
   * creating a new one.
   */
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

  /**
   * The function "handleReset" resets multiple state variables to their initial values.
   */
  const handleReset = () => {
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

  /**
   * The function takes a string and returns the last word of that string.
   * @param {string} str - The input string from which we want to extract the last word.
   * @returns The function `getLastWord` takes a string as input and returns the last word of that
   * string.
   */
  const getLastWord = (str: string) => {
    const words = str.split(" ");
    return words[words.length - 1];
  };

  /**
   * The function handles keydown events for a textarea element and sets the last word of the lyrics
   * when the space or enter key is pressed.
   * @param e - KeyboardEvent<HTMLTextAreaElement> - This is the type of the event object that is
   * passed to the function when a key is pressed down in a HTMLTextAreaElement. It contains
   * information about the key that was pressed, such as the key code and the key name.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === " " || e.key === "Enter") {
      setLastWord(getLastWord(lyrics));
    }
  };

  /**
   * This function adds a given word to a string of lyrics and sets the last word as the given word.
   * @param {string} word - word is a string parameter that represents a word that is being passed as
   * an argument to the handleLeftClick function.
   */
  const handleLeftClick = (word: string) => {
    setLyrics(lyrics + word + " ");
    setLastWord(word);
  };

  /**
   * This code defines several async functions that use various APIs to retrieve related words and set
   * them as state values.
   */
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

  /* This is a useEffect hook that runs whenever the `lastWord` state variable changes. It calls
  several async functions that use various APIs to retrieve related words and sets them as state
  values. These related words include rhymes, sound-alikes, nouns, adjectives, synonyms, antonyms,
  frequent followers, and related words. */
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

  /* This `useEffect` hook is fetching data for an existing note from a Firestore database and setting
  the state variables `title`, `lyrics`, `themes`, and `lastWord` based on the data retrieved. It
  runs whenever the `existingNoteId` state variable changes. */
  useEffect(() => {
    const fetchNoteData = async () => {
      if (existingNoteId) {
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
      }
    };
    fetchNoteData();
  }, [existingNoteId]);

  /* This `useEffect` hook is automatically saving the note to the Firestore database every 2 seconds
  if the `noteId` state variable is truthy (meaning an existing note is being edited). It creates a
  `saveTimer` using `setTimeout` that calls the `autoSave` function after 2 seconds. The `autoSave`
  function creates a `note` object with the current values of `title`, `lyrics`, `themes`, and
  `lastEditedAt` (which is set to the current server timestamp), and then updates the Firestore
  document for the current note with the new `note` object. The `return` statement in the
  `useEffect` hook clears the `saveTimer` using `clearTimeout` to prevent the `autoSave` function
  from being called multiple times. This `useEffect` hook runs whenever `title`, `lyrics`, `themes`,
  or `noteId` changes. */
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
