"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import { gsap } from "gsap";


type Scene =
  | "opening"
  | "meadow"
  | "memory"
  | "letter"
  | "mood"
  | "happy"
  | "sad"
  | "tired"
  | "missing"
  | "comfort"
  | "todo"
  | "birthday";


export default function Home() {
  const [scene, setScene] = useState<Scene>("opening");

  const [transitioning, setTransitioning] = useState(false);
  const [pendingScene, setPendingScene] = useState<Scene | null>(null);

  const transitionVideoRef = useRef<HTMLVideoElement>(null);

  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mobilaAudioRef = useRef<HTMLAudioElement | null>(null);
  

  /*
   * =========================
   * VIDEO TRANSITION
   * =========================
   */

  const goToScene = (nextScene: Scene) => {
    if (transitioning || nextScene === scene) return;

    setPendingScene(nextScene);
    setTransitioning(true);
  };

 useEffect(() => {
  if (!transitioning) return;

  const video = transitionVideoRef.current;
  if (!video) return;

  video.currentTime = 0;

  video.play().catch((error) => {
    console.error("Tulip transition failed:", error);
    finishTransition();
  });
}, [transitioning]);

  const finishTransition = () => {
    if (pendingScene) {
      setScene(pendingScene);
    }

    setTimeout(() => {
      setPendingScene(null);
      setTransitioning(false);
    }, 150);
  };

  /*
   * =========================
   * MUSIC
   * =========================
   */

  useEffect(() => {
  const anbe = new Audio("/anbe-en-anbe.mp3");
  const mobila = new Audio("/mobila%20mobila.mp3");

  anbe.loop = true;
  anbe.volume = 0.55;

  mobila.loop = true;
  mobila.volume = 0.55;

  audioRef.current = anbe;
  mobilaAudioRef.current = mobila;

  return () => {
    anbe.pause();
    anbe.src = "";

    mobila.pause();
    mobila.src = "";
  };
}, []);

  const startWorld = async () => {
    try {
      await audioRef.current?.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }

    setScene("meadow");
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  /*
   * =========================
   * MAIN WORLD
   * =========================
   */

  return (
    <main className={`world scene-${scene}`}>

      <div className="world-noise" />

<AnimatePresence mode="wait">
  
<motion.div
  key={scene}
  initial={{
    opacity: 0,
    scale: 0.975,
    filter: "blur(5px)",
  }}
  animate={{
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  }}
  exit={{
    opacity: 0,
    scale: 1.025,
    filter: "blur(5px)",
  }}
  transition={{
    duration: 0.65,
    ease: [0.22, 1, 0.36, 1],
  }}
>


        {scene === "opening" && (
          <OpeningScene onEnter={startWorld} />
        )}

        {scene === "meadow" && (
          <MeadowScene
            onNext={() => goToScene("memory")}
          />
        )}

        {scene === "memory" && (
          <MemoryScene
            onNext={() => goToScene("letter")}
          />
        )}

        {scene === "letter" && (
          <LetterScene
            onNext={() => goToScene("mood")}
          />
        )}

        {scene === "mood" && (
          <MoodScene
            onNext={(mood) => {
              if (mood === "happy") goToScene("happy");
              else if (mood === "sad") goToScene("sad");
              else if (mood === "tired") goToScene("tired");
              else if (mood === "missing") goToScene("missing");
              else if (mood === "comfort") goToScene("comfort");
            }}
            onFinish={() => goToScene("todo")}
          />
        )}

        {scene === "happy" && (
          <HappyScene onNext={() => goToScene("mood")} />
        )}

        {scene === "sad" && (
          <SadScene onNext={() => goToScene("mood")} />
        )}

        {scene === "tired" && (
          <TiredScene onNext={() => goToScene("mood")} />
        )}

        {scene === "missing" && (
          <MissingScene onNext={() => goToScene("mood")} />
        )}

        {scene === "comfort" && (
          <ComfortScene onNext={() => goToScene("mood")} />
        )}

        {scene === "todo" && (
          <TodoScene onNext={() => goToScene("birthday")} />
        )}

        {scene === "birthday" && <BirthdayScene
  audioRef={audioRef}
  mobilaAudioRef={mobilaAudioRef}
 />}

  </motion.div>
</AnimatePresence>


      {/* =====================================
          TULIP VIDEO TRANSITION
      ===================================== */}

 {transitioning &&
  typeof document !== "undefined" &&
  createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2147483647,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <video
        ref={transitionVideoRef}
        src="/videos/tulip-transition.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"

        onEnded={finishTransition}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>,
    document.body
  )}


      {/* =====================================
          MUSIC BUTTON
      ===================================== */}

      {scene !== "opening" && (
        <button
          className="music-button"
          onClick={toggleMusic}
        >
          {musicOn ? "Music on" : "Music off"}
        </button>
      )}


      <div className="world-footer">
        <span>May 11, 2026</span>
        <span>Still counting</span>
      </div>

    </main>
  );
}

/* =========================
   OPENING
========================= */


function OpeningScene({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const openingRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = openingRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const background = backgroundRef.current;
      const small = smallRef.current;
      const title = titleRef.current;
      const line = lineRef.current;
      const subtitle = subtitleRef.current;
      const button = buttonRef.current;

      gsap.set([small, title, subtitle, button], {
        autoAlpha: 0,
        y: 24,
      });

      gsap.set(line, {
        scaleX: 0,
        transformOrigin: "center",
        autoAlpha: 0,
      });

      if (background) {
        gsap.fromTo(
          background,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 4,
            ease: "power2.out",
          }
        );
      }

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .to(small, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
        })
        .to(
          title,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
          },
          "-=0.25"
        )
        .to(
          line,
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.9,
          },
          "-=0.3"
        )
        .to(
          subtitle,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.2"
        )
        .to(
          button,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
          },
          "-=0.15"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={openingRef}
      className="scene opening-scene"
    >
      <div
        ref={backgroundRef}
        className="opening-background"
        aria-hidden="true"
      />

      <div className="opening-glow" aria-hidden="true">
        <div className="opening-light opening-light-one" />
        <div className="opening-light opening-light-two" />
        <div className="opening-light opening-light-three" />
      </div>

      <div className="opening-content">
        <p ref={smallRef} className="opening-small">
          A little world made for you
        </p>

        <h1 ref={titleRef}>SOFZZZZ</h1>

        <div ref={lineRef} className="opening-line" />

        <p ref={subtitleRef} className="opening-subtitle">
          Some worlds are not found.
          <br />
          They are made.
        </p>

        <button
          ref={buttonRef}
          className="enter-button"
          onClick={onEnter}
        >
          Enter Your World
        </button>
      </div>
    </section>
  );
}


/* =========================
   MEADOW
========================= */

function MeadowScene({
  onNext,
}: {
  onNext: () => void;
}) {
  return (
    <motion.section
      className="scene meadow-scene"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.5 }}
    >

      <div className="meadow-overlay" />

      <div className="meadow-content">

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          It started with something simple...
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
        >
          A field of tulips
        </motion.h1>

        <motion.p
          className="meadow-small"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          and a journey that is still counting.
        </motion.p>

        <motion.button
          className="continue-button"
          onClick={onNext}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1 }}
        >
          Walk a little further
        </motion.button>

      </div>

      <BlossomBurst />

    </motion.section>
  );
}


/* =========================
   BLOSSOM
========================= */

function BlossomBurst() {
  const petals = Array.from({ length: 32 });

  return (
    <div className="blossom-burst">

      {petals.map((_, index) => (
        <motion.span
          key={index}
          className="blossom-petal"
          initial={{
            opacity: 0,
            scale: 0.2,
            x: "50vw",
            y: "50vh",
            rotate: 0,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.2, 1, 0.7],
            x: `${20 + Math.random() * 60}vw`,
            y: `${20 + Math.random() * 60}vh`,
            rotate: 360,
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

    </div>
  );
}


/* =========================
   MEMORY WORLD
========================= */


function MemoryScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const memoryRef = useRef<HTMLElement>(null);

  
useEffect(() => {
  const root = memoryRef.current;
  if (!root) return;
  const cleanupListeners: (() => void)[] = [];

  const ctx = gsap.context(() => {
    const background = root.querySelector(".memory-background");
    const intro = root.querySelector(".memory-intro");
    const cards = root.querySelectorAll<HTMLElement>(
      ".memory-gallery .memory-photo, .memory-gallery .memory-video"
    );
    const videoCard = root.querySelector<HTMLElement>(".memory-video");
    const bottom = root.querySelector(".memory-bottom");

    const rotations: Record<string, number> = {
      "main-one": -3,
      "main-two": 3,
      "side-one": -6,
      "side-two": 5,
      "side-three": 4,
      "side-four": -5,
      "side-five": 4,
    };

    if (background) {
      gsap.fromTo(
        background,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 2.5,
          ease: "power2.out",
        }
      );
    }

    if (intro) {
      gsap.fromTo(
        intro,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
        }
      );
    }

    // Photos settle into their original scrapbook angles
    gsap.set(cards, {
      autoAlpha: 0,
      y: 35,
      scale: 0.9,
      rotate: 0,
      transformOrigin: "center center",
    });

    const cardTimeline = gsap.timeline({
      delay: 0.35,
      defaults: { ease: "power3.out" },
    });

    cards.forEach((card, index) => {
      const className = Array.from(card.classList).find(
        (name) => rotations[name] !== undefined
      );

      const angle = className ? rotations[className] : 0;

      cardTimeline.to(
        card,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: angle,
          duration: 0.85,
          ease: "back.out(1.25)",
        },
        index === 0 ? 0 : "-=0.62"
      );

      // Gentle lift and zoom on hover
      const lift = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.045,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const settle = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("pointerenter", lift);
      card.addEventListener("pointerleave", settle);
      cleanupListeners.push(() => {
  card.removeEventListener("pointerenter", lift);
  card.removeEventListener("pointerleave", settle);
});

      // Remove listeners when this scene unmounts
      
    });

    // Video gets an extra cinematic entrance
    if (videoCard) {
      gsap.fromTo(
        videoCard,
        { filter: "brightness(0.65)" },
        {
          filter: "brightness(1)",
          duration: 1.1,
          delay: 0.8,
          ease: "power2.out",
        }
      );
    }

    if (bottom) {
      gsap.fromTo(
        bottom,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out",
        }
      );
    }
  }, root);

  return () => {
  cleanupListeners.forEach((cleanup) => cleanup());
  ctx.revert();
};
}, []);


  return (
    <motion.section
      ref={memoryRef}
      className="scene memory-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div className="memory-background" />

      <div className="memory-intro">
        <p>BEFORE WE GO ANYWHERE...</p>
        <h2>Let's keep a few moments here.</h2>
      </div>

      <div className="memory-gallery">
        <div className="memory-photo side-photo side-one">
          <img src="/images/side1.jpeg" alt="Memory 1" />
        </div>

        <div className="memory-photo side-photo side-two">
          <img src="/images/side2.jpeg" alt="Memory 2" />
        </div>

        <div className="memory-photo side-photo side-three">
          <img src="/images/side3.jpeg" alt="Memory 3" />
        </div>

        <div className="memory-photo side-photo side-four">
          <img src="/images/side4.jpeg" alt="Memory 4" />
        </div>

        <div className="memory-video side-five">
          <video
            src="/images/side5.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <span className="video-label">a little moment</span>
        </div>

        <div className="memory-photo main-photo main-one">
          <img src="/images/main1.jpeg" alt="Main memory 1" />
        </div>

        <div className="memory-photo main-photo main-two">
          <img src="/images/main2.jpeg" alt="Main memory 2" />
        </div>
      </div>

      <div className="memory-bottom">
        <p>Some moments don't need a reason to stay.</p>

        <button className="continue-button" onClick={onNext}>
          Continue the journey
        </button>
      </div>
    </motion.section>
  );
}


/* =========================
   LETTER WORLD
========================= */




function LetterScene({ onNext }: { onNext: () => void }) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const sceneRef = useRef<HTMLElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sceneRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (stage === 0) {
        gsap.fromTo(
          ".letter-heading",
          { autoAlpha: 0, y: -18 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(
          ".letter-next",
          { autoAlpha: 0, y: 15 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: 0.6,
            ease: "power3.out",
          }
        );
      }

      if (stage === 1 && envelopeRef.current) {
        gsap.fromTo(
          envelopeRef.current,
          { autoAlpha: 0, y: 60, scale: 0.75, rotate: -8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 1.1,
            ease: "back.out(1.5)",
          }
        );
        gsap.fromTo(
          ".envelope-open-button",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: 0.55,
          }
        );
      }

      if (stage === 2 && paperRef.current) {
        gsap.fromTo(
          paperRef.current,
          { autoAlpha: 0, y: 100, scale: 0.86, rotateX: -8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.2,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          paperRef.current.querySelectorAll(".letter-date, .letter-text p, .letter-signature"),
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.22,
            delay: 0.45,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".letter-next",
          { autoAlpha: 0, y: 15 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: 2.1,
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [stage]);

  return (
    <section ref={sceneRef} className={`scene letter-scene letter-stage-${stage}`}>
      <div className="letter-photo" />
      <div className="letter-overlay" />

      {stage === 0 && (
        <>
          <div className="letter-heading">
            <span>A LETTER I WANTED YOU TO KEEP</span>
          </div>

          <button className="letter-next" onClick={() => setStage(1)}>
            Find your letter ♡
          </button>
        </>
      )}

      {stage === 1 && (
        <div className="envelope-stage">
          <p className="envelope-caption">Something I wanted you to keep…</p>

          <div ref={envelopeRef} className="love-envelope">
            <div className="envelope-back" />
            <div className="envelope-paper-preview">
              A little note, just for you
            </div>
            <div className="envelope-front" />
            <div className="envelope-flap" />
            <div className="envelope-seal">♡</div>
          </div>

          <button
            className="envelope-open-button"
            onClick={() => setStage(2)}
          >
            Open your letter 💌
          </button>
        </div>
      )}

      {stage === 2 && (
        <>
          <div className="letter-heading letter-heading-open">
            <span>A LITTLE PIECE OF MY HEART</span>
          </div>

          <div ref={paperRef} className="vintage-letter">
            <div className="paper-stain stain-one" />
            <div className="paper-stain stain-two" />
            <div className="paper-stain stain-three" />
            <div className="letter-torn-top" />

            <div className="letter-inner">
              <div className="letter-date">for sofzzz ♡</div>

              <div className="letter-text">
                <p>
                  Heyy sofzzz ne evaloo special theiryumaaa enakuu lam nee rombha
                  adigam diii🤌💗💗becoz ennalam yarum ivalo pasamaa love panna
                  maatanga unakaee theiryumm la enaku neriyaa prblms Iruku short
                  tempor andha mathri lam😅 but neee enna rombha vaee porutukitaaa
                  thaa ...
                </p>

                <p>
                  Rombhavee enakuu unnaa pudikumm thaaa💗💗💗💗💗💗🫶❤️‍🔥😻🫂en
                  life laa nee ellam engayooo irukaaa idhu varikum na yarukitayum
                  ivalooo close aanadhu illa ellatiyum na share pannren literally
                  allll🥰🥰...
                </p>

                <p>
                  nee en life long koda irukanummm thaa 💞✨🫂 neriya naaal thonum
                  nee enaku kedachaa giftt nu adhuvum rombha surprise aa
                  unexpected a kedachaa periyaa gift thaa🧿❤️♾️
                </p>

                <p>
                  ennnaaa vitutuuuuu engaiyummm poiradhaaaa diiii 🫠🙂 ennna nallaaa
                  pathukooo diii naaanum unna pathukirenn🤌epovom en kodavaee iruuu
                  dii💗💗🫠🫂🧿
                </p>
              </div>

              <div className="letter-signature">
                always,
                <br />
                <span>♡</span>
              </div>
            </div>

            <div className="letter-torn-bottom" />
            <div className="pressed-flower">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <button className="letter-next" onClick={onNext}>
            Turn the page ♡
          </button>
        </>
      )}
    </section>
  );
}




/* =========================
   MOOD
========================= */

function MoodScene({
  onNext,
  onFinish,
}: {
  onNext: (mood: string) => void;
  onFinish: () => void;
}) {
  return (
    <section className="scene mood-scene">

      <div className="mood-background" />
      <div className="mood-dark" />

      <div className="mood-content">

        <p className="mood-eyebrow">
          A LITTLE PLACE FOR YOU
        </p>

        <h1>
          How are you
          <br />
          feeling today?
        </h1>

        <p className="mood-subtitle">
          You don't have to explain anything.
          <br />
          Just choose what your heart feels.
        </p>

        <div className="mood-options">

          <button onClick={() => onNext("happy")}>
            Happy
          </button>

          <button onClick={() => onNext("sad")}>
            Sad
          </button>

          <button onClick={() => onNext("tired")}>
            Tired
          </button>

          <button onClick={() => onNext("missing")}>
            Missing someone
          </button>

          <button onClick={() => onNext("comfort")}>
            Need a little comfort
          </button>

        </div>

        <button className="mood-finish-button" onClick={onFinish}>
          Continue to our plans ♡
        </button>

      </div>

    </section>
  );
}


/* =========================
   HAPPY WORLD
========================= */



function HappyScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const ropeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!letterRef.current) return;

    gsap.set(letterRef.current, {
      autoAlpha: 0,
      y: 70,
      rotate: -2,
      scale: 0.96,
    });
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (revealed) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    draggingRef.current = true;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!draggingRef.current || revealed) return;

    const distance = Math.max(
      0,
      Math.min(180, event.clientY - startYRef.current)
    );

    setPullDistance(distance);

    if (distance >= 100) {
      draggingRef.current = false;
      setRevealed(true);

      if (letterRef.current) {
        gsap.to(letterRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        });
      }

      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.45)",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggingRef.current || revealed) return;

    draggingRef.current = false;
    setPullDistance(0);

    if (ropeRef.current) {
      gsap.to(ropeRef.current, {
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section className="scene happy-scene happy-rope-scene">
      <div className="happy-background" />
      <div className="happy-overlay" />

      <div className="happy-rope-heading">
        <p className="happy-eyebrow">A LITTLE NOTE FOR YOU</p>
        <p className="happy-pull-hint">
          {revealed
            ? "A little note, just for you ♡"
            : "Pull the little handle to reveal your letter"}
        </p>
      </div>

      <div
  className="happy-rope"
  aria-hidden="true"
  style={{
    height: `calc(29% + ${pullDistance}px)`,
    transition: draggingRef.current
      ? "none"
      : "height 0.4s ease",
  }}
>
  <div className="happy-rope-line" />
</div>

      <div
        ref={ropeRef}
        className="happy-rope-handle"
        style={{
  transform: `translate(-50%, ${pullDistance}px)`,
  transition: draggingRef.current
    ? "none"
    : "transform 0.4s ease",
}}
      >
        <button
          type="button"
          className="happy-pull-button"
          aria-label="Pull down to reveal the letter"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={revealed}
        >
          <span className="happy-rope-knot" />
          <span className="happy-rope-label">
            {revealed ? "♡" : "PULL"}
          </span>
        </button>
      </div>

      <div
        ref={letterRef}
        className="happy-letter happy-rope-letter"
        aria-hidden={!revealed}
      >
        <p>
          Oii sofzzz enakuu Ennanu lam theriyilaa
          naa eppomeyy unna mattum tha nenachukituu
          irupenn...every day nd every moments la nee
          enkoda irukanum nu 🫶🫂💗....adhuvum na
          happy ya irukara apo kandipaa nee enkoda
          irukanum🥰...un life edhunalum naa unna
          happy ya vechupenn cherii yaa✨nee tha enakuu
          ellameyy naaa unna rombha preserve panni
          vechupenn🧿💯❤️‍🔥nee enakuu eppomeyy
          happyyyyyyyy ya iruaknummm🎉🎉
        </p>
      </div>

      {revealed && (
        <button
          className="happy-next happy-rope-next"
          onClick={onNext}
        >
          Continue the journey
        </button>
      )}
    </section>
  );
}



function SadScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const ropeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!letterRef.current) return;

    gsap.set(letterRef.current, {
      autoAlpha: 0,
      y: 70,
      rotate: -2,
      scale: 0.96,
    });
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (revealed) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    draggingRef.current = true;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!draggingRef.current || revealed) return;

    const distance = Math.max(
      0,
      Math.min(180, event.clientY - startYRef.current)
    );

    setPullDistance(distance);

    if (distance >= 100) {
      draggingRef.current = false;
      setRevealed(true);

      if (letterRef.current) {
        gsap.to(letterRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        });
      }

      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.45)",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggingRef.current || revealed) return;

    draggingRef.current = false;
    setPullDistance(0);

    if (ropeRef.current) {
      gsap.to(ropeRef.current, {
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section className="scene sad-scene sad-rope-scene">
      <div className="sad-background" />
      <div className="sad-overlay" />

      <div className="happy-rope-heading">
        <p className="sad-eyebrow">A LITTLE NOTE FOR YOU</p>
        <p className="happy-pull-hint">
          {revealed
            ? "You are never alone ♡"
            : "Pull the little handle to reveal your letter"}
        </p>
      </div>

      <div className="happy-rope" aria-hidden="true">
        <div className="happy-rope-line" />
      </div>

      <div
        ref={ropeRef}
        className="happy-rope-handle"
        style={{ transform: `translate(-50%, ${pullDistance}px)` }}
      >
        <button
          type="button"
          className="happy-pull-button"
          aria-label="Pull down to reveal the letter"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={revealed}
        >
          <span className="happy-rope-knot" />
          <span className="happy-rope-label">
            {revealed ? "♡" : "PULL"}
          </span>
        </button>
      </div>

      <div
        ref={letterRef}
        className="sad-letter happy-rope-letter"
        aria-hidden={!revealed}
      >
        <p>
          Inga paaru ne eppovom thaniya illa di
          adhaa purnjukooo 🤌✨ unakuu eppolaa
          lonely aa feel aagudhoo juz one call
          pannu ...na eppovom un call ku wait
          pannuven rombha Rombha excitement odaa
          😊🫠kandipaa edunalum sollu epponalum
          na wait pannitaeyy irupenn❤️‍🩹🧿eduva
          irundhalum teddyyy ya katiiii pidchukaaaaa
          🫂🫂malai 🌧️ la ooru suttuvomm
        </p>
      </div>

      {revealed && (
        <button
          className="sad-next happy-rope-next"
          onClick={onNext}
        >
          Continue the journey
        </button>
      )}
    </section>
  );
}



function TiredScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const ropeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!letterRef.current) return;

    gsap.set(letterRef.current, {
      autoAlpha: 0,
      y: 70,
      rotate: -2,
      scale: 0.96,
    });
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (revealed) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    draggingRef.current = true;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!draggingRef.current || revealed) return;

    const distance = Math.max(
      0,
      Math.min(180, event.clientY - startYRef.current)
    );

    setPullDistance(distance);

    if (distance >= 100) {
      draggingRef.current = false;
      setRevealed(true);

      if (letterRef.current) {
        gsap.to(letterRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        });
      }

      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.45)",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggingRef.current || revealed) return;

    draggingRef.current = false;
    setPullDistance(0);

    if (ropeRef.current) {
      gsap.to(ropeRef.current, {
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section className="scene mood-letter-scene tired-scene tired-rope-scene">
      <div className="mood-letter-background" />
      <div className="mood-letter-overlay" />

      <div className="happy-rope-heading">
        <p className="mood-letter-eyebrow">
          A LITTLE NOTE FOR YOU 🌷
        </p>
        <p className="happy-pull-hint">
          {revealed
            ? "You are stronger than you think ♡"
            : "Pull the little handle to reveal your letter"}
        </p>
      </div>

      <div className="happy-rope" aria-hidden="true">
        <div className="happy-rope-line" />
      </div>

      <div
        ref={ropeRef}
        className="happy-rope-handle"
        style={{
          transform: `translate(-50%, ${pullDistance}px)`,
        }}
      >
        <button
          type="button"
          className="happy-pull-button"
          aria-label="Pull down to reveal the letter"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={revealed}
        >
          <span className="happy-rope-knot" />
          <span className="happy-rope-label">
            {revealed ? "♡" : "PULL"}
          </span>
        </button>
      </div>

      <div
        ref={letterRef}
        className="mood-letter-card happy-rope-letter"
        aria-hidden={!revealed}
      >
        <p>
          Heyy soplaangiii olungaa eduvum yosikamaaa
          jlyy ya iruu diii 🤌 nee eppovom strong
          gurllll serii yaa💪💪namma innum neriyaa
          pakkaa porom idhulam ne easyya handle
          panniruvaa enaku theriyummm🫠❤️‍🩹...innum
          nammaa netherlands laa poganum soo ready
          ya iruuu🧿🫂💗
        </p>
      </div>

      {revealed && (
        <button
          className="mood-letter-next happy-rope-next"
          onClick={onNext}
        >
          Continue the journey
        </button>
      )}
    </section>
  );
}



function MissingScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const ropeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!letterRef.current) return;

    gsap.set(letterRef.current, {
      autoAlpha: 0,
      y: 70,
      rotate: -2,
      scale: 0.96,
    });
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (revealed) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    draggingRef.current = true;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!draggingRef.current || revealed) return;

    const distance = Math.max(
      0,
      Math.min(180, event.clientY - startYRef.current)
    );

    setPullDistance(distance);

    if (distance >= 100) {
      draggingRef.current = false;
      setRevealed(true);

      if (letterRef.current) {
        gsap.to(letterRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        });
      }

      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.45)",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggingRef.current || revealed) return;

    draggingRef.current = false;
    setPullDistance(0);

    if (ropeRef.current) {
      gsap.to(ropeRef.current, {
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section className="scene mood-letter-scene missing-scene missing-rope-scene">
      <div className="mood-letter-background" />
      <div className="mood-letter-overlay" />

      <div className="happy-rope-heading">
        <p className="mood-letter-eyebrow">
          A LITTLE NOTE FOR YOU 🌷
        </p>
        <p className="happy-pull-hint">
          {revealed
            ? "You are never alone ♡"
            : "Pull the little handle to reveal your letter"}
        </p>
      </div>

      <div className="happy-rope" aria-hidden="true">
        <div className="happy-rope-line" />
      </div>

      <div
        ref={ropeRef}
        className="happy-rope-handle"
        style={{
          transform: `translate(-50%, ${pullDistance}px)`,
        }}
      >
        <button
          type="button"
          className="happy-pull-button"
          aria-label="Pull down to reveal the letter"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={revealed}
        >
          <span className="happy-rope-knot" />
          <span className="happy-rope-label">
            {revealed ? "♡" : "PULL"}
          </span>
        </button>
      </div>

      <div
        ref={letterRef}
        className="mood-letter-card happy-rope-letter"
        aria-hidden={!revealed}
      >
        <p>
          Heyy paithyooo ennaa miss panriyaa
          yaraiyachumm😅😅saavu aduchuruven moodituu
          free ya viduuu...enna alavuku unna yaru
          love pannuvaa😊😝naa iruekn laa adhuveyy
          podhum yaraiyum thedadhaa plzzz🫠😅✨naa
          unna pathupen yaru ponalum unkaeyy nalla
          theriyum , I am capable 😝😁🫂 yaraiyum
          miss pannadhaa becoz Edinburgh missing uuuu😁
        </p>
      </div>

      {revealed && (
        <button
          className="mood-letter-next happy-rope-next"
          onClick={onNext}
        >
          Continue the journey
        </button>
      )}
    </section>
  );
}



function ComfortScene({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const ropeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!letterRef.current) return;

    gsap.set(letterRef.current, {
      autoAlpha: 0,
      y: 70,
      rotate: -2,
      scale: 0.96,
    });
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (revealed) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    draggingRef.current = true;
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!draggingRef.current || revealed) return;

    const distance = Math.max(
      0,
      Math.min(180, event.clientY - startYRef.current)
    );

    setPullDistance(distance);

    if (distance >= 100) {
      draggingRef.current = false;
      setRevealed(true);

      if (letterRef.current) {
        gsap.to(letterRef.current, {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.15,
          ease: "power3.out",
        });
      }

      if (ropeRef.current) {
        gsap.to(ropeRef.current, {
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.45)",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggingRef.current || revealed) return;

    draggingRef.current = false;
    setPullDistance(0);

    if (ropeRef.current) {
      gsap.to(ropeRef.current, {
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <section className="scene mood-letter-scene comfort-scene comfort-rope-scene">
      <div className="mood-letter-background" />
      <div className="mood-letter-overlay" />

      <div className="happy-rope-heading">
        <p className="mood-letter-eyebrow">
          A LITTLE NOTE FOR YOU 🌷
        </p>
        <p className="happy-pull-hint">
          {revealed
            ? "A little comfort, just for you ♡"
            : "Pull the little handle to reveal your letter"}
        </p>
      </div>

      <div className="happy-rope" aria-hidden="true">
        <div className="happy-rope-line" />
      </div>

      <div
        ref={ropeRef}
        className="happy-rope-handle"
        style={{
          transform: `translate(-50%, ${pullDistance}px)`,
        }}
      >
        <button
          type="button"
          className="happy-pull-button"
          aria-label="Pull down to reveal the letter"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={revealed}
        >
          <span className="happy-rope-knot" />
          <span className="happy-rope-label">
            {revealed ? "♡" : "PULL"}
          </span>
        </button>
      </div>

      <div
        ref={letterRef}
        className="mood-letter-card happy-rope-letter"
        aria-hidden={!revealed}
      >
        <p>
          Sofiaaaaaaaaaa enna diii comfort venumaaa😅
          adhaa naa Irukenn laaa podadhaaaa ...illa
          unakuu nejamalae thonuchuu na edunalum sollu ..
          I think so I am comfortable for uu🫠illanalum
          paravilaa nee enaku comfort thaaa🫂Olunga pack
          panni vaii namma comfort aa apdiyaee mdu poitu
          vandhom laa adhey mathrii paris poganum soo
          seikramaa dii azhgiii🎉💗✨
        </p>
      </div>

      {revealed && (
        <button
          className="mood-letter-next happy-rope-next"
          onClick={onNext}
        >
          Continue the journey
        </button>
      )}
    </section>
  );
}



/* =========================
   BIRTHDAY
========================= */



function TodoScene({ onNext }: { onNext: () => void }) {
  const [page, setPage] = useState(0);
  


const pagePhotos = [
  [
    { src: "/images/scrapbook/cover1.jpeg", caption: "our little world ♡", tilt: "left" },
    { src: "/images/scrapbook/cover2.jpeg", caption: "where our story begins", tilt: "right" },
  ],
  [
    { src: "/images/scrapbook/places1.jpeg", caption: "somewhere in Switzerland ♡", tilt: "left" },
    { src: "/images/scrapbook/places2.jpeg", caption: "our someday adventure", tilt: "right" },
  ],
  [
    { src: "/images/scrapbook/food1.jpeg", caption: "a little dessert date", tilt: "left" },
    { src: "/images/scrapbook/food2.jpeg", caption: "sweet moments together ♡", tilt: "right" },
  ],
  [
    { src: "/images/scrapbook/activities1.jpeg", caption: "silly pictures", tilt: "left" },
    { src: "/images/scrapbook/activities2.jpeg", caption: "making little memories", tilt: "right" },
  ],
  [
    { src: "/videos/scrapbook/movies1.mp4", caption: "one more movie?", tilt: "left", type: "video" },
    { src: "/videos/scrapbook/movies2.mp4", caption: "our cosy little nights", tilt: "right", type: "video" },
  ],
  [
    { src: "/videos/scrapbook/memories1.mp4", caption: "moments to keep forever", tilt: "left", type: "video" },
    { src: "/videos/scrapbook/memories2.mp4", caption: "remember this day ♡", tilt: "right", type: "video" },
  ],
  [
    { src: "/images/scrapbook/promises1.jpeg", caption: "words from the heart", tilt: "left" },
    { src: "/images/scrapbook/promises2.jpeg", caption: "always and forever ♡", tilt: "right" },
  ],
];



  const pages = [
    {
      eyebrow: "A LITTLE BOOK OF US",
      title: "Our Little\nPlans",
      subtitle: "little dreams, favourite things & a lifetime of memories",
      items: [],
      sticker: "♡ 11.05.2026 ♡",
      note: "A little collection of places to go, things to try, movies to watch, and promises to keep. All with you. ♡",
    },
    {
      eyebrow: "CHAPTER ONE",
      title: "Places We Dream Of",
      subtitle: "Someday, let's see these places together...",
      items: [
        ["01", "Switzerland", "Mountains, little walks & pretty views."],
        ["02", "Paris", "Explore the streets and take silly pictures."],
        ["03", "Edinburgh", "Wander around like we're in a storybook."],
      ],
      sticker: "our someday list ✈",
    },
    {
      eyebrow: "CHAPTER TWO",
      title: "A Little Taste of Happiness",
      subtitle: "Because every memory needs something sweet...",
      items: [
        ["♡", "Brownies & Black Forest cake", "A proper dessert day."],
        ["♡", "Dairy Milk, KitKat & Kinder Joy", "Our little chocolate collection."],
        ["♡", "Cookies & hot chocolate", "A cosy day with no plans."],
      ],
      sticker: "sweet moments only 🍫",
    },
    {
      eyebrow: "CHAPTER THREE",
      title: "Things We Must Do",
      subtitle: "Little adventures that turn into big memories...",
      items: [
        ["01", "Take silly pictures", "No perfect poses, just us."],
        ["02", "Watch a sunset", "And stay until the sky changes."],
        ["03", "Exchange little surprises", "Just because we thought of each other."],
        ["04", "Make our own scrapbook", "Keep the little things forever."],
      ],
      sticker: "memories in the making ♡",
    },
    {
      eyebrow: "CHAPTER FOUR",
      title: "Our Movie Nights",
      subtitle: "Blankets, snacks and one more movie...",
      items: [
        ["01", "A comfort movie", "For the days we need a little warmth."],
        ["02", "A comedy night", "Laugh until our stomachs hurt."],
        ["03", "A movie marathon", "Snacks ready, phones away."],
      ],
      sticker: "you pick the movie 🎬",
    },
    {
      eyebrow: "CHAPTER FIVE",
      title: "Our Little Memories",
      subtitle: "The ordinary days we'll want to remember...",
      items: [
        ["♡", "Keep our favourite pictures", "Even the blurry, funny ones."],
        ["♡", "Save our favourite songs", "Songs that bring us back to a moment."],
        ["♡", "Celebrate little wins", "Every tiny achievement deserves happiness."],
      ],
      sticker: "to remember, always ♡",
    },
    {
      eyebrow: "THE LAST PAGE",
      title: "Our Promises",
      subtitle: "Not perfect promises. Just promises from the heart.",
      items: [
        ["♡", "I promise to listen", "Even when finding the right words is hard."],
        ["♡", "I promise to care", "Especially on the difficult days."],
        ["♡", "I promise to celebrate you", "Your little wins matter too."],
        ["♡", "I promise to keep making memories", "One little moment at a time."],
        ["∞", "And always be kind", "Because the little things mean everything."],
      ],
      sticker: "our story is still being written...",
    },
  ];

  
const photos = [
  {
    src: "/images/main1.jpeg",
    caption: "one of my favourite memories ♡",
    tilt: "left",
  },
  {
    src: "/images/main2.jpeg",
    caption: "a little moment with you",
    tilt: "right",
  },
];


  const current = pages[page];
  const isCover = page === 0;
  const isLast = page === pages.length - 1;

  return (
    <motion.section
      className="scene todo-scene scrapbook-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <video
        className="todo-video"
        src="/videos/todo-list.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="todo-overlay" />

      <div className="scrapbook-content">
        <p className="todo-eyebrow">OUR LITTLE PLANS ♡</p>

        <div className="scrapbook-book">
          {/* LEFT PAGE: PHOTO COLLAGE */}
          <div className="scrapbook-left-page">
            <p className="scrapbook-left-heading">Little pieces of us</p>

            
<div className="scrapbook-photo-collage">
  {pagePhotos[page].map((photo) => (
    <div
      className={`scrapbook-photo-wrap scrapbook-polaroid scrapbook-tilt-${photo.tilt}`}
      key={photo.src}
    >
      
{"type" in photo && photo.type === "video" ? (
  <video
    className="scrapbook-photo"
    src={photo.src}
    controls
    playsInline
    preload="metadata"
  />
) : (
  <img
    className="scrapbook-photo"
    src={photo.src}
    alt={photo.caption}
    loading="lazy"
  />
)}

      <p className="scrapbook-photo-label">
        {photo.caption}
      </p>
    </div>
  ))}
</div>


            <p className="scrapbook-left-note">
              collected with love, saved forever ♡
            </p>
            <span className="scrapbook-left-sticker">✿ 11.05.2026 ✿</span>
          </div>

          {/* RIGHT PAGE: CHAPTER CONTENT */}
          <motion.div
            key={page}
            className={`scrapbook-page ${isCover ? "scrapbook-cover" : ""}`}
            initial={{
              opacity: 0,
              rotateY: 65,
              scale: 0.98,
              x: 12,
            }}
            animate={{
              opacity: 1,
              rotateY: 0,
              scale: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              rotateY: -55,
              scale: 0.98,
              x: -10,
            }}
            transition={{
              opacity: { duration: 0.25 },
              rotateY: { duration: 0.55, ease: [0.45, 0, 0.2, 1] },
              scale: { duration: 0.55, ease: "easeOut" },
              x: { duration: 0.55, ease: "easeInOut" },
            }}
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="scrapbook-page-content">
              <p className="scrapbook-chapter">{current.eyebrow}</p>

              <h1>
                {current.title.split("\n").map((line, i) => (
                  <span key={`${page}-${i}`}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h1>

              <p className="scrapbook-subtitle">{current.subtitle}</p>

              {!isCover && (
                <div className="scrapbook-items">
                  {current.items.map(([number, title, description]) => (
                    <div className="scrapbook-item" key={title}>
                      <span className="scrapbook-item-number">{number}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isCover && (
                <div className="scrapbook-cover-note">
                  {current.note}
                </div>
              )}

              <p className="scrapbook-page-sticker">{current.sticker}</p>

              <div className="scrapbook-page-number">
                {String(page + 1).padStart(2, "0")} /{" "}
                {String(pages.length).padStart(2, "0")}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="scrapbook-controls">
          <button
            className="scrapbook-arrow"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <span className="scrapbook-progress">
            {page + 1} of {pages.length} pages
          </span>

          {isLast ? (
            <button
              className="todo-next scrapbook-next"
              onClick={onNext}
            >
              One last little surprise ♡
            </button>
          ) : (
            <button
              className="todo-next scrapbook-next"
              onClick={() => setPage((p) => Math.min(p + 1, pages.length - 1))}
            >
              {isCover ? "Open our book ♡" : "Turn the page →"}
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}



function BirthdayScene({
  audioRef,
  mobilaAudioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  mobilaAudioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [stage, setStage] = useState<"wish" | "blow" | "cut" | "done">("wish");
  const [letterOpen, setLetterOpen] = useState(false);

  const birthdayRef = useRef<HTMLElement>(null);
  const surpriseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const target = new Date(2026, 10, 23, 0, 0, 0).getTime();
      const diff = Math.max(0, target - Date.now());

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = birthdayRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".birthday-gate-inner",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.to(".birthday-gate-glow", {
        scale: 1.12,
        opacity: 0.8,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(".birthday-gate-petal", {
        y: "random(35,100)",
        x: "random(-30,30)",
        rotation: "random(-90,90)",
        opacity: 0,
        duration: "random(5,9)",
        repeat: -1,
        stagger: { each: 0.7, from: "random" },
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!unlocked || !surpriseRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".birthday-surprise-card",
        { opacity: 0, y: 35, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.4)" }
      );

      gsap.fromTo(
        ".birthday-bouquet",
        { opacity: 0, x: -45, rotation: -12 },
        { opacity: 1, x: 0, rotation: 0, duration: 1.1, delay: 0.25, ease: "power3.out" }
      );

      gsap.fromTo(
        ".birthday-cake-new",
        { opacity: 0, y: 45, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.35, ease: "back.out(1.5)" }
      );
    }, surpriseRef);

    return () => ctx.revert();
  }, [unlocked]);

  useEffect(() => {
    if (stage !== "done" || !surpriseRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".birthday-cake-knife",
        { x: -28, y: -12, rotation: -22, opacity: 0 },
        { x: 8, y: 12, rotation: 8, opacity: 1, duration: 0.45, ease: "power2.inOut" }
      );

      gsap.fromTo(
        ".birthday-cake-slice",
        { x: 0, y: 0, rotation: 0, opacity: 0 },
        { x: 42, y: -15, rotation: 12, opacity: 1, duration: 0.75, delay: 0.25, ease: "back.out(1.5)" }
      );

      gsap.fromTo(
        ".birthday-confetti-bit",
        { y: 0, opacity: 0, scale: 0.4 },
        {
          y: () => gsap.utils.random(-190, -65),
          x: () => gsap.utils.random(-150, 150),
          rotation: () => gsap.utils.random(-260, 260),
          opacity: 0,
          scale: 1.2,
          duration: 2.1,
          stagger: 0.035,
          ease: "power2.out",
        }
      );
    }, surpriseRef);

    return () => ctx.revert();
  }, [stage]);

const submitPin = () => {
  console.log("PIN entered:", pin);

  if (pin === "1819") {
    setPinError(false);

    const anbe = audioRef.current;
    const mobila = mobilaAudioRef.current;

    console.log("Anbe ref:", !!anbe);
    console.log("Mobila ref:", !!mobila);

    anbe?.pause();

    setUnlocked(true);

    if (mobila) {
      mobila.pause();
      mobila.currentTime = 0;

      mobila.play()
        .then(() => {
          console.log("MOBILA SONG STARTED!");
        })
        .catch((error) => {
          console.error("MOBILA PLAY ERROR:", error);
        });
    }
  } else {
    setPinError(true);
    setPin("");

    if (birthdayRef.current) {
      gsap.fromTo(
        ".birthday-pin-box",
        { x: -8 },
        {
          x: 8,
          duration: 0.07,
          repeat: 5,
          yoyo: true,
          clearProps: "x"
        }
      );
    }
  }
};

  const nextStage = () => {
    if (stage === "wish") {
      setStage("blow");
      return;
    }

    if (stage === "blow") {
      gsap.to(".birthday-flame", {
        scale: 0,
        opacity: 0,
        y: -8,
        duration: 0.45,
        stagger: 0.1,
        ease: "power2.in",
      });

      gsap.fromTo(
        ".birthday-smoke",
        { opacity: 0, y: 0, scale: 0.7 },
        { opacity: 0.55, y: -28, scale: 1.5, duration: 1.15, stagger: 0.12, ease: "power1.out" }
      );

      setStage("cut");
      return;
    }

    if (stage === "cut") {
      setStage("done");
      return;
    }
  };

  return (
    <motion.section
      ref={birthdayRef}
      className="scene birthday-scene birthday-gate-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="birthday-image" />
      <div className="birthday-overlay" />
      <div className="birthday-gate-glow" aria-hidden="true" />

      <div className="birthday-gate-petals" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span className="birthday-gate-petal" key={i}>✿</span>
        ))}
      </div>

      {!unlocked ? (
        <div className="birthday-gate-inner">
          <p className="birthday-gate-kicker">A LITTLE SURPRISE IS WAITING</p>
          <p className="birthday-gate-date">23 · 11 · 2026</p>
          <h2 className="birthday-gate-title">
            A world made <em>just for you.</em>
          </h2>
          <p className="birthday-gate-copy">
            Every second brings your little surprise closer.
          </p>

          <div className="birthday-gate-countdown" aria-label="Birthday countdown">
            <div><strong>{timeLeft.days}</strong><span>Days</span></div>
            <div><strong>{String(timeLeft.hours).padStart(2, "0")}</strong><span>Hours</span></div>
            <div><strong>{String(timeLeft.minutes).padStart(2, "0")}</strong><span>Minutes</span></div>
            <div><strong>{String(timeLeft.seconds).padStart(2, "0")}</strong><span>Seconds</span></div>
          </div>

          <div className="birthday-pin-box">
            <div className="birthday-lock-icon">♡</div>
            <h3>A little secret code</h3>
            <p>18 to 19 — a new chapter begins.</p>

            <div className="birthday-pin-dots" aria-label="Four digit PIN">
              {Array.from({ length: 4 }, (_, i) => (
                <span className={pin.length > i ? "filled" : ""} key={i}>●</span>
              ))}
            </div>

            <input
              className="birthday-pin-input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setPinError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitPin();
              }}
              placeholder="Enter 4-digit PIN"
              aria-label="Enter four digit PIN"
            />

            <button
              type="button"
              className="birthday-unlock-button"
              onClick={submitPin}
            >
              Unlock your surprise ♡
            </button>

            {pinError && (
              <p className="birthday-pin-error" role="alert">
                Not quite. Try your special date again ♡
              </p>
            )}
          </div>

          <p className="birthday-gate-foot">
            Some moments are worth waiting for. ♡
          </p>
        </div>
      ) : (
        <div className="birthday-surprise-wrap" ref={surpriseRef}>
          <div className="birthday-surprise-card">
            <p className="birthday-gate-kicker">THE WAIT IS OVER</p>

            <h2 className="birthday-gate-title">
              Happy Birthday, <em>SOFZZZZ.</em>
            </h2>

            <p className="birthday-gate-copy">
              A little cake, a bouquet, and a wish made just for you.
            </p>

            <div className="birthday-gift-stage">
              <div
                className="birthday-bouquet realistic-bouquet"
                role="img"
                aria-label="A hand-tied bouquet of pink tulips and roses"
              >
                <svg viewBox="0 0 190 220" className="bouquet-art" aria-hidden="true">
                  <defs>
                    <linearGradient id="wrapPaper" x1="0" x2="1">
                      <stop stopColor="#b86d83" />
                      <stop offset=".48" stopColor="#f4c5d0" />
                      <stop offset="1" stopColor="#a95e78" />
                    </linearGradient>

                    <linearGradient id="petalPink" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#ffb8cb" />
                      <stop offset=".55" stopColor="#e85f91" />
                      <stop offset="1" stopColor="#a92f65" />
                    </linearGradient>

                    <linearGradient id="leafGreen" x1="0" x2="1">
                      <stop stopColor="#315f45" />
                      <stop offset=".5" stopColor="#78a56e" />
                      <stop offset="1" stopColor="#244b39" />
                    </linearGradient>
                  </defs>

                  <g fill="none" stroke="#527d59" strokeWidth="3" strokeLinecap="round">
                    <path d="M95 177 Q78 105 38 48" />
                    <path d="M96 178 Q95 105 95 32" />
                    <path d="M98 178 Q120 105 151 52" />
                    <path d="M92 179 Q63 122 68 78" />
                    <path d="M101 179 Q133 130 127 83" />
                  </g>

                  <g fill="url(#leafGreen)" stroke="#315b42" strokeWidth="1">
                    <path d="M76 142 Q34 105 25 124 Q42 151 76 142Z" />
                    <path d="M105 139 Q146 98 159 119 Q143 148 105 139Z" />
                    <path d="M86 159 Q44 139 43 158 Q61 179 86 159Z" />
                    <path d="M106 160 Q148 137 151 157 Q132 178 106 160Z" />
                  </g>

                  <g fill="url(#petalPink)" stroke="#b83f70" strokeWidth="1.2">
                    <path d="M23 54 Q18 25 34 12 Q45 28 40 56 Q33 68 23 54Z" />
                    <path d="M34 55 Q36 23 52 18 Q59 39 45 59 Q39 65 34 55Z" />
                    <path d="M80 38 Q73 8 94 2 Q109 16 101 42 Q91 55 80 38Z" />
                    <path d="M94 42 Q101 10 119 15 Q122 39 104 51 Q98 52 94 42Z" />
                    <path d="M139 59 Q137 28 155 19 Q169 36 157 64 Q148 72 139 59Z" />
                    <path d="M151 62 Q161 31 177 37 Q178 58 160 69 Q154 70 151 62Z" />
                    <path d="M54 86 Q48 62 66 52 Q81 66 72 90 Q63 98 54 86Z" />
                    <path d="M117 91 Q111 66 130 57 Q144 73 135 96 Q126 103 117 91Z" />
                  </g>

                  <g fill="#f7a3bd" stroke="#d95d8d" strokeWidth="1">
                    <circle cx="95" cy="28" r="12" />
                    <path d="M85 28 Q95 7 105 28 Q95 45 85 28Z" />
                    <circle cx="66" cy="75" r="8" />
                    <circle cx="130" cy="78" r="8" />
                  </g>

                  <path
                    d="M47 119 L143 119 L126 211 Q95 224 64 211Z"
                    fill="url(#wrapPaper)"
                    stroke="#f8d5df"
                    strokeWidth="2"
                  />

                  <path d="M47 119 L95 153 L143 119" fill="none" stroke="#ffe5eb" strokeWidth="2" opacity=".8" />

                  <path
                    d="M77 181 Q95 166 113 181 Q95 195 77 181Z"
                    fill="#f8dce4"
                    stroke="#b86d83"
                    strokeWidth="2"
                  />

                  <path
                    d="M95 181 L95 204 M95 190 Q79 190 75 202 M95 190 Q111 190 115 202"
                    fill="none"
                    stroke="#a64f70"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* CAKE START */}
              <div
                className={`birthday-cake-new ${
                  stage === "done" ? "cake-cut" : ""
                } ${
                  stage === "blow" || stage === "cut" || stage === "done"
                    ? "candles-out"
                    : ""
                }`}
              >
                <div className="birthday-candle-row">
                  <i className="birthday-candle-new">
                    <b className="birthday-flame" />
                    <b className="birthday-smoke" />
                  </i>

                  <i className="birthday-candle-new">
                    <b className="birthday-flame" />
                    <b className="birthday-smoke" />
                  </i>

                  <i className="birthday-candle-new">
                    <b className="birthday-flame" />
                    <b className="birthday-smoke" />
                  </i>
                </div>

                <div className="birthday-frosting" />
                <div className="birthday-cake-body-new"><span>♡</span></div>
                <div className="birthday-cake-plate-new" />

                {stage === "done" && (
                  <div className="birthday-cake-slice">♡</div>
                )}

                {stage === "done" && (
                  <div className="birthday-cake-knife" aria-hidden="true" />
                )}
              </div>
              {/* CAKE END */}
            </div>

            {/* WISH STAGE */}
            {stage === "wish" && (
              <div className="birthday-step-message">
                <h3>First, make a wish ✨</h3>
                <p>
                  Close your eyes for a moment. Think of something beautiful you wish for.
                </p>
                <button
                  type="button"
                  className="birthday-unlock-button"
                  onClick={nextStage}
                >
                  I made my wish ♡
                </button>
              </div>
            )}

            {/* BLOW CANDLES STAGE */}
            {stage === "blow" && (
              <div className="birthday-step-message">
                <h3>Now, blow the candles 🌬</h3>
                <p>Take a little breath and make this moment yours.</p>
                <button
                  type="button"
                  className="birthday-unlock-button"
                  onClick={nextStage}
                >
                  Blow the candles ♡
                </button>
              </div>
            )}

            {/* CUT CAKE STAGE */}
            {stage === "cut" && (
              <div className="birthday-step-message">
                <h3>One little slice of happiness 🍰</h3>
                <p>Ready to cut your birthday cake?</p>
                <button
  type="button"
  className="birthday-unlock-button"
  onClick={() => {
    console.log("REACT CLICK FIRED");
    setStage("done");
  }}
>
  Cut the cake ♡
</button>
              </div>
            )}

            {/* BIRTHDAY CELEBRATION */}
            {stage === "done" && (
              <div className="birthday-step-message">
                <h3>Let the celebrations begin! ♡</h3>
                <p>May this year bring you the sweetest little things.</p>

                <button
                  type="button"
                  className="birthday-unlock-button"
                  onClick={() => setLetterOpen((v) => !v)}
                >
                  {letterOpen
                    ? "Close your letter ↑"
                    : "Open your birthday letter ↓"}
                </button>

                {letterOpen && (
                  <div className="birthday-letter birthday-letter-new">
                    <p className="letter-kicker">A note, just for you</p>

                    <p>
                      Some people make life a little more beautiful just by being in it. And you're one of those people. ♡
                    </p>

                    <p>
                      I hope this new chapter of your life brings you endless happiness, peaceful days, beautiful surprises, and dreams that slowly turn into reality.
                    </p>

                    <p>
                      Never stop being the person you are. Keep smiling, keep dreaming, and never doubt how special you are. On your difficult days, I hope you remember that you deserve the same kindness and care you give to the world.
                    </p>

                    <p>
                      From our silly moments to the little memories we've collected, every moment has its own special place. And this is just the beginning — there are still so many places to visit, stories to create, songs to sing, and memories waiting for us.
                    </p>

                    <p>Happy 19th Birthday, SOFZZZZZ!</p>

                    <p>
                      May this year be as beautiful as your heart. Here's to another chapter filled with laughter, love, and countless little reasons to smile.
                    </p>

                    <span>Always a little corner of happiness for you. ♡</span>
                  </div>
                )}
              </div>
            )}

            {/* CONFETTI */}
            {stage === "done" && (
              <div className="birthday-confetti-layer" aria-hidden="true">
                {Array.from({ length: 28 }, (_, i) => (
                  <span className="birthday-confetti-bit" key={i}>
                    {i % 3 === 0 ? "♡" : i % 3 === 1 ? "✦" : "✿"}
                  </span>
                ))}
              </div>
            )}
          </div>

          {stage === "done" && <BirthdayMemoryGallery />}
        </div>
      )}
    </motion.section>
  );
}

function BirthdayMemoryGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = galleryRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".birthday-memory-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="birthday-memory-section birthday-memory-section-new"
      ref={galleryRef}
    >
      <div className="birthday-memory-heading">
        <span>THE LITTLE THINGS WE KEEP</span>
        <h3>Our moments, <em>always.</em></h3>
        <p>A few pieces of our little world, saved right here.</p>
      </div>

      <div className="birthday-memory-grid">
        <figure className="birthday-memory-card memory-card-tall">
          <img src="/images/main1.jpeg" alt="A favourite shared memory" loading="lazy" />
          <figcaption>one for the heart ♡</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-small">
          <img src="/images/side1.jpeg" alt="A little memory together" loading="lazy" />
          <figcaption>little moments</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-small">
          <img src="/images/side2.jpeg" alt="A saved happy moment" loading="lazy" />
          <figcaption>tiny happiness</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-wide">
          <img src="/images/main2.jpeg" alt="Another favourite memory" loading="lazy" />
          <figcaption>still one of my favourites ♡</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-small">
          <img src="/images/side3.jpeg" alt="A memory worth keeping" loading="lazy" />
          <figcaption>keep this one</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-small">
          <img src="/images/side4.jpeg" alt="A small moment to remember" loading="lazy" />
          <figcaption>our little world</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-video">
          <video src="/images/side5.mp4" muted loop autoPlay playsInline preload="metadata" />
          <figcaption>a little moment in motion ♡</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-video">
          <video src="/videos/scrapbook/memories1.mp4" controls muted loop playsInline preload="metadata" />
          <figcaption>memory one ♡</figcaption>
        </figure>

        <figure className="birthday-memory-card memory-card-video">
          <video src="/videos/scrapbook/memories2.mp4" controls muted loop playsInline preload="metadata" />
          <figcaption>memory two ♡</figcaption>
        </figure>
      </div>

      <div className="birthday-finale">
        <p>And the best part?</p>
        <h3>There are still so many <em>memories to make.</em></h3>
        <p className="birthday-finale-note">
          May life be gentle with you, and may happiness keep finding you. ♡
        </p>
      </div>
    </div>
  );
}