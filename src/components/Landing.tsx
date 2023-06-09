import { TxtAnime } from "txtanime.js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LandingProps {
  loggedIn: boolean;
}

const Landing = ({ loggedIn }: LandingProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    new TxtAnime(".typing", {
      effect: "txt-an-7",
      delay: 0.05,
      duration: 0.07,
      repeat: true,
      text: ["Can't stop writing", "Keep the flow going", "Always undefeated"],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".rhymes", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "exciting lighting fighting biting whiting sighting inciting handwriting underwriting citing",
        "owing knowing hoeing sewing boeing showing rowing bowing sowing towing",
        "conceited depleted defeated completed treated repeated seated heated greeted",
      ],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".soundalikes", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "science lightning trying titan abiding striking elighten timing lining whining",
        "ongoing outgoing folling foregoing easygoing doing smoking rowan hoping growing",
        "people reason season excited genus treason committed appreciated jesus venus",
      ],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".synonyms", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "composition authorship penning",
        "release loss exit departure passing expiration sledding leaving",
        "triumphant victorious unbowed unbeaten unconquered unvanquished",
      ],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".related", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "verbal math directing exam poetry screenplay script essays editing sat",
        "happen nba really",
        "",
      ],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".adjectives", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "table desk campaign paper room master process case campaigns pad skills",
        "concern back further chronicle deeper out time down away places",
        "season team champion army record seasons teams enemy champions streak",
      ],
    });
  }, []);

  useEffect(() => {
    new TxtAnime(".nouns", {
      effect: "txt-an-4",
      delayStart: 3.75,
      delay: 0.5,
      duration: 1.6,
      repeat: true,
      text: [
        "creative own good historical much automatic academic fine hand american",
        "church easy cinema sea thorough keep college school get movie",
        "",
      ],
    });
  }, []);

  return (
    <div className="flex flex-col w-screen flex-grow items-center">
      <h1 className="text-5xl text-center m-4 mt-10">
        Welcome to <span className="text-primary-content font-bold">Rhyme</span>
        <span className="text-secondary-content font-bold">Page</span>
      </h1>
      <h2 className="text-3xl text-center m-2">
        An API powered lyric writing application that writes your rhymes with
        you!
      </h2>
      <div className="card bg-secondary text-secondary-content m-4">
        <p className="text-3xl text-center text-secondary-content m-2 alt-font typing p-5"></p>
      </div>
      <div className="grid md:grid-cols-6 grid-cols-3 my-20 content-center m-5 gap-5">
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Rhymes</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font rhymes"></p>
        </div>
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Sound-Alikes</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font soundalikes"></p>
        </div>
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Synonyms</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font synonyms"></p>
        </div>
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Related Words</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font related"></p>
        </div>
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Adjectives</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font adjectives"></p>
        </div>
        <div className="flex flex-col items-center m-4 gap-4">
          <h3 className="text-lg">Nouns</h3>
          <p className="text-md text-center text-accent self-center pr-20 alt-font nouns"></p>
        </div>
      </div>
      <div className="h-1/5 w-full"></div>
        {loggedIn ? (
          <p className="text-center text-2xl text-neutral-content">
            Ready to get started?{" "}
            <a onClick={() => navigate('/dashboard')} className="text-primary-content hover:cursor-pointer">
              Go to your dashboard!
            </a>
          </p>
        ) : (
          <>
          <p className="text-center text-2xl text-neutral-content">
            Want to get started?{" "}
            <a onClick={() => navigate('/register')} className="text-primary-content hover:cursor-pointer">
              Register
            </a>{" "}
            or{" "}
            <a onClick={() => navigate('/login')} className="text-primary hover:cursor-pointer">
              Login
            </a>{" "}
            now!
          </p>
          <p className="text-center text-lg text-neutral-content">
            Don't want to sign up quite yet?{" "}
            <a onClick={() => navigate('/dashboard')} className="text-accent-content hover:cursor-pointer">
              Try the demo!
            </a>
          </p>
          </>
        )}
    </div>
  );
};

export default Landing;
