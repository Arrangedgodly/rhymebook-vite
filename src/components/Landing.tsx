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
    <div className="container-main">
      <h1 className="md:text-5xl text-3xl text-center m-4 mt-10">
        Welcome to <span className="text-primary font-bold">Rhyme</span>
        <span className="text-secondary font-bold">Page</span>
      </h1>
      <h2 className="md:text-3xl text-xl text-center m-2">
        An API powered lyric writing application that writes your rhymes with
        you!
      </h2>
      <div className="card bg-secondary text-secondary-content m-4">
        <p className="md:text-3xl text-xl text-center text-secondary-content m-2 alt-font typing p-5"></p>
      </div>
      <div className="grid md:grid-cols-6 grid-cols-3 my-5 content-center m-5 gap-5">
        <div className="container-landing">
          <h3 className="text-landing-title text-md">Rhymes</h3>
          <p className="text-landing md:text-md rhymes"></p>
        </div>
        <div className="container-landing container-landing-alt">
          <h3 className="text-landing-title text-md">Sound-Alikes</h3>
          <p className="text-landing md:text-md soundalikes"></p>
        </div>
        <div className="container-landing container-landing-alt">
          <h3 className="text-landing-title text-md">Synonyms</h3>
          <p className="text-landing md:text-md synonyms"></p>
        </div>
        <div className="container-landing container-landing-alt">
          <h3 className="text-landing-title text-md">Related Words</h3>
          <p className="text-landing md:text-md related"></p>
        </div>
        <div className="container-landing">
          <h3 className="text-landing-title text-md">Adjectives</h3>
          <p className="text-landing md:text-md adjectives"></p>
        </div>
        <div className="container-landing">
          <h3 className="text-landing-title text-md">Nouns</h3>
          <p className="text-landing md:text-md nouns"></p>
        </div>
      </div>
      <div className="h-1/5 w-full"></div>
        {loggedIn ? (
          <p className="text-center md:text-2xl text-lg text-primary my-5">
            Ready to get started?{" "}
            <a onClick={() => navigate('/notes/new')} className="text-primary hover:cursor-pointer">
              Go to your dashboard!
            </a>
          </p>
        ) : (
          <>
          <p className="text-center md:text-2xl text-lg text-primary my-5">
            Want to get started?{" "}
            <a onClick={() => navigate('/register')} className="text-primary font-bold hover:cursor-pointer">
              Register
            </a>{" "}
            or{" "}
            <a onClick={() => navigate('/login')} className="text-primary font-bold hover:cursor-pointer">
              Login
            </a>{" "}
            now!
          </p>
          <p className="text-center md:text-lg text-sm text-primary">
            Don't want to sign up quite yet?{" "}
            <a onClick={() => navigate('/notes/new')} className="text-accent hover:cursor-pointer">
              Try the demo!
            </a>
          </p>
          </>
        )}
    </div>
  );
};

export default Landing;
