import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { RiUserFollowLine } from "react-icons/ri";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface ProfileProps {
  currentUser: any;
}

const Profile = ({ currentUser }: ProfileProps) => {
  const navigate = useNavigate();
  const [noteCount, setNoteCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const db = getFirestore();

  const handleNotesCount = async () => {
    if (currentUser) {
      const notesCollection = collection(db, "notes");
      const notesQuery = query(
        notesCollection,
        where("userId", "==", currentUser.uid)
      );
      const notesSnapshot = await getDocs(notesQuery);
      if (notesSnapshot) {
        setNoteCount(notesSnapshot.docs.length);
      }
    }
  };

  const handleFollowersCount = async () => {
    if (currentUser) {
      const followersCollection = collection(
        db,
        "users",
        currentUser.uid,
        "followers"
      );
      const followersSnapshot = await getDocs(followersCollection);
      if (followersSnapshot) {
        setFollowerCount(followersSnapshot.docs.length);
      }
    }
  };

  useEffect(() => {
    handleNotesCount();
    handleFollowersCount();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="container-main justify-center">
      <div className="card items-center bordered bg-primary shadow-lg w-96 mb-20">
        <h1 className="card-title text-2xl m-2">{currentUser.displayName}</h1>
        <div className="card-body items-center">
          <div className="avatar placeholder">
            <div className="w-32 h-32 rounded-full bg-neutral-focus">
              <img src={currentUser.photoURL} alt="profile" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-center text-neutral-content m-2">
              {currentUser.email}
            </p>
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-figure text-secondary">
                  <MdOutlineStickyNote2 className="w-6 h-6" />
                </div>
                <div className="stat-title">Total Notes</div>
                <div className="stat-value">{noteCount}</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-figure text-accent">
                  <RiUserFollowLine className="w-6 h-6" />
                </div>
                <div className="stat-title">Followers</div>
                <div className="stat-value">{followerCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
