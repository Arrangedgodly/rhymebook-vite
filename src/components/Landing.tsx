import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TxtAnime } from "txtanime.js";

interface LandingProps {
  loggedIn: boolean;
}

/**
 * The hero types these in order, and the columns below show what RhymePage
 * returns for the last word of whichever one is on screen: writing, going,
 * undefeated. The two are kept in step by watching the hero, so the columns
 * cannot drift out of sync with it.
 */
const PHRASES = [
  "Can't stop writing",
  "Keep the flow going",
  "Always undefeated",
];

interface Column {
  label: string;
  /** The four secondary categories only appear once there is room for six. */
  secondary: boolean;
  /** One sample per phrase, in the same order, eight words apiece. */
  samples: [string, string, string];
}

/*
 * Real Datamuse output for writing / going / undefeated. Three cells are
 * curated rather than fetched, because the API genuinely returns nothing
 * usable there: related words and adjectives for "undefeated", and related
 * words for "going", which comes back as "happen nba really".
 *
 * Adjectives and Nouns were previously the wrong way round -- "writing desk"
 * and "writing paper" are nouns that the word modifies (rel_jja), while
 * "creative writing" and "good writing" are the adjectives (rel_jjb).
 */
const WORDS_PER_SAMPLE = 8;

/** Beat between the phrase landing and the words answering it. */
const REVEAL_DELAY_MS = 450;

const COLUMNS: Column[] = [
  {
    label: "Rhymes",
    secondary: false,
    samples: [
      "exciting inviting moonlighting highlighting reciting biting slighting flyting",
      "knowing showing lowing bowing owing sowing rowing hoeing",
      "conceited defeated depleted treated pleated cheated heated maltreated",
    ],
  },
  {
    label: "Sound-Alikes",
    secondary: true,
    samples: [
      "enticing striking enlightened writhing abiding frightened providing enlighten",
      "easygoing ongoing floating closing glowing roaming hoping flowing",
      "conceded excited committed beaten unheeded appreciated feted treason",
    ],
  },
  {
    label: "Synonyms",
    secondary: true,
    samples: [
      "composition authorship penning script prose text lettering longhand",
      "release exit departure passing expiration loss leaving sledding",
      "triumphant victorious unbowed unbeaten unconquered unvanquished unbeatable supreme",
    ],
  },
  {
    label: "Related Words",
    secondary: true,
    samples: [
      "verbal math directing exam poetry screenplay script essays",
      "concern rate price forth onward ahead homeward away",
      "streak season champion title record perfect unbeaten run",
    ],
  },
  {
    label: "Adjectives",
    secondary: false,
    samples: [
      "creative own good historical much automatic academic fine",
      "church easy cinema sea thorough keep college school",
      "perfect flawless spotless dominant historic storied remarkable unblemished",
    ],
  },
  {
    label: "Nouns",
    secondary: false,
    samples: [
      "table desk campaign paper room master process case",
      "concern back further chronicle deeper out time down",
      "season team champion army record seasons teams enemy",
    ],
  },
];

const Landing = ({ loggedIn }: LandingProps) => {
  const navigate = useNavigate();

  /** Which phrase the hero is showing; the columns follow it. */
  const [phraseIndex, setPhraseIndex] = useState(0);
  /* A constantly-animating page is hostile to anyone who asked for less of it. */
  const [animate] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!animate) {
      document.querySelectorAll<HTMLElement>(".typing").forEach((el) => {
        el.textContent = PHRASES[0];
      });
      document.querySelectorAll<HTMLElement>(".text-landing").forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    new TxtAnime(".typing", {
      effect: "txt-an-7",
      delay: 0.05,
      duration: 0.07,
      repeat: true,
      text: PHRASES,
    });
  }, [animate]);

  /*
   * Drive the columns off the hero's own state rather than a second timer.
   *
   * The effect does not type text in: a phrase appears complete, holds for
   * about three seconds, then erases one character at a time by setting
   * display:none from the end. "Complete" means every character span is
   * still displayed.
   *
   * The words fade out in lockstep with that erase -- opacity is set directly
   * to the fraction of the phrase still visible above, on every character, so
   * the two are the same motion rather than two motions timed to line up.
   * Only the landing side, once the next phrase is fully up, gets an eased
   * transition, since that appearance is instant rather than gradual and
   * needs its own animation to read as a reveal.
   */
  useEffect(() => {
    if (!animate) return;
    const hero = document.querySelector<HTMLElement>(".typing");
    if (!hero) return;

    let revealTimer: number | undefined;
    // Guards re-arming the reveal timer on every incidental mutation while a
    // phrase already sits fully up.
    let phraseIsUp = false;

    const setWordsOpacity = (value: number, eased: boolean) => {
      document.querySelectorAll<HTMLElement>(".text-landing").forEach((el) => {
        el.style.transition = eased ? "opacity 0.35s ease" : "none";
        el.style.opacity = String(value);
      });
    };

    const sync = () => {
      const characters = Array.from(
        hero.querySelectorAll<HTMLElement>("span")
      ).filter((span) => span.children.length === 0);

      if (characters.length === 0) {
        /*
         * Between phrases. TxtAnime hides its last character and clears the
         * element in the same tick, so the ratio below never actually lands
         * on the ratio 0/16 -- it stalls around 1/16 -- and this is the only
         * point that reliably is a true, full disappear.
         */
        window.clearTimeout(revealTimer);
        phraseIsUp = false;
        setWordsOpacity(0, false);
        return;
      }

      const visibleCount = characters.filter(
        (span) => span.style.display !== "none"
      ).length;
      const complete = visibleCount === characters.length;

      if (!complete) {
        window.clearTimeout(revealTimer);
        phraseIsUp = false;
        setWordsOpacity(visibleCount / characters.length, false);
        return;
      }

      if (phraseIsUp) return;
      phraseIsUp = true;

      /*
       * Read which phrase this is now, but do not touch the DOM with it yet.
       * Swapping the sample content here, the instant the phrase completes,
       * left the new words sitting in the page for the whole reveal delay --
       * invisible in principle, but it is what made the columns read as
       * loading in before the phrase above had actually finished. Content
       * and reveal now change in the same step, once, when the delay fires.
       */
      const shown = (hero.textContent ?? "").trim();
      const index = PHRASES.indexOf(shown);

      revealTimer = window.setTimeout(() => {
        if (index >= 0) setPhraseIndex(index);
        setWordsOpacity(1, true);
      }, REVEAL_DELAY_MS);
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(hero, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
      window.clearTimeout(revealTimer);
    };
  }, [animate]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Welcome to <span className="text-primary">Rhyme</span>
          <span className="text-secondary">Page</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl opacity-70 md:text-lg">
          An API-powered lyric notebook that writes your rhymes with you.
        </p>

        <div className="mx-auto mt-6 w-fit max-w-full rounded-lg bg-secondary px-6 py-4 text-secondary-content">
          <p className="alt-font typing min-h-[1.6em] text-xl md:text-2xl" />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {loggedIn ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/notes/new")}
            >
              Go to your dashboard
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Create an account
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => navigate("/notes/new")}
              >
                Or try the demo
              </button>
            </>
          )}
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-base-300 px-3 py-6 md:px-6">
        <h2 className="text-center text-[0.68rem] font-medium uppercase tracking-[0.14em] opacity-55">
          Finish a word and you get all of this back
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 lg:grid-cols-6">
          {COLUMNS.map(({ label, secondary, samples }) => (
            <div
              key={label}
              className={`container-landing ${secondary ? "container-landing-alt" : ""}`}
            >
              <h3 className="text-landing-title">{label}</h3>
              <p className="text-landing">
                <span className="landing-sample">
                  {samples[phraseIndex]
                    .split(" ")
                    .slice(0, WORDS_PER_SAMPLE)
                    .map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
