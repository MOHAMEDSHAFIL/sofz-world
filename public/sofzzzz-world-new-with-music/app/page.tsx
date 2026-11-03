 "use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

type Scene =
  | "opening"
  | "meadow"
  | "house"
  | "dream"
  | "switzerland"
  | "paris"
  | "edinburgh"
  | "netherlands"
  | "comfort"
  | "letters"
  | "sky"
  | "birthday";

const places = [
  { id: "switzerland" as const, label: "Switzerland", emoji: "🏔️", text: "A dream can have a door too." },
  { id: "paris" as const, label: "Paris", emoji: "🗼", text: "Maybe one day this won't be a dream anymore." },
  { id: "edinburgh" as const, label: "Edinburgh", emoji: "🏰", text: "Some places just feel like stories." },
  { id: "netherlands" as const, label: "Netherlands", emoji: "🌷", text: "You said you liked tulips... so I made you a whole field." },
];

const letters = [
  { title: "Open when you need a smile", text: "Whatever today looks like, I hope something tiny makes you smile." },
  { title: "Open when you're tired", text: "You don't have to finish everything today. Rest is allowed too." },
  { title: "Open when you need someone", text: "No explanation needed. Just imagine this little world keeping a light on for you." },
  { title: "Open on a random day", text: "This wasn't made only for special days. Come here whenever you feel like it." },
];

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [scene, setScene] = useState<Scene>("opening");
  const [musicOn, setMusicOn] = useState(false);
  const [letter, setLetter] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState(0);

  const startWorld = async () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    }
    setScene("meadow");
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    } else {
      audio.pause();
      setMusicOn(false);
    }
  };

  const goToPlace = (index: number) => {
    setSelectedPlace(index);
    setScene(places[index].id);
  };

  const nextPlace = () => {
    if (selectedPlace < places.length - 1) {
      goToPlace(selectedPlace + 1);
    } else {
      setScene("comfort");
    }
  };

  return (
    <main className={`world scene-${scene}`}>
      <audio
        ref={audioRef}
        src="/anbe-en-anbe.mp3"
        loop
        preload="auto"
      />

      <div className="world-noise" />
      <div className="floating-petals">
        <span>🌸</span>
        <span>🌸</span>
        <span>🌸</span>
        <span>🌸</span>
      </div>

      <motion.button
        className="music-control"
        onClick={toggleMusic}
        whileTap={{ scale: 0.94 }}
        aria-label={musicOn ? "Pause music" : "Play music"}
      >
        <span>{musicOn ? "♫" : "♪"}</span>
        <small>{musicOn ? "Anbe En Anbe · Playing" : "Play Anbe En Anbe"}</small>
        <b>{musicOn ? "Ⅱ" : "▶"}</b>
      </motion.button>

      <AnimatePresence mode="wait">

        {scene === "opening" && (
          <motion.section
            key="opening"
            className="scene-inner opening-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
          >
            <div className="opening-copy">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                Hey...
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1.2 }}>
                SOFZZZZ...
              </motion.h1>
              <motion.div className="opening-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
                11 · 05 · 2026
              </motion.div>
              <motion.p className="opening-line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
                Everything here started on that day.
                <br />
                And somehow... we&apos;re still counting. ♾️
              </motion.p>

              <motion.button
                className="primary-button"
                onClick={startWorld}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Open your world <span>🚪</span>
              </motion.button>

              <motion.div
                className="music-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6 }}
              >
                🎵 Anbe En Anbe will stay with you through the whole journey
              </motion.div>
            </div>
          </motion.section>
        )}

        {scene === "meadow" && (
          <WorldScene
            key="meadow"
            eyebrow="THE FIRST PLACE"
            title={<>A little world<br /><em>made for you.</em></>}
            text="Walk a little. There is no rush here."
            className="meadow-scene"
            action="Walk to the little house"
            onAction={() => setScene("house")}
          >
            <div className="meadow-house">
              <div className="house-roof" />
              <div className="house-body">
                <div className="house-window" />
                <div className="house-door" />
              </div>
            </div>
            <div className="meadow-flowers">🌷 🌷 🌷 🌷 🌷 🌷 🌷</div>
            <div className="path" />
          </WorldScene>
        )}

        {scene === "house" && (
          <WorldScene
            key="house"
            eyebrow="A SMALL PLACE INSIDE THE WORLD"
            title={<>Come inside,<br /><em>there&apos;s warmth here.</em></>}
            text="A record player, a few chocolates, a window, and some little things waiting to be discovered."
            className="house-scene"
            action="Open the dream door"
            onAction={() => setScene("dream")}
          >
            <div className="room">
              <div className="room-window"><span>🌙</span></div>
              <div className="room-teddy">🧸</div>
              <div className="room-chocolates">🍫 🍪 🍰</div>
              <div className="record-player">💿</div>
              <div className="room-lamp">🛋️</div>
            </div>
          </WorldScene>
        )}

        {scene === "dream" && (
          <WorldScene
            key="dream"
            eyebrow="SOMEWHERE YOU'VE ALWAYS WANTED TO GO"
            title={<>One door.<br /><em>Many dreams.</em></>}
            text="Choose a door and step through it. The world will change around you."
            className="dream-scene"
            action="Open the first dream door"
            onAction={() => goToPlace(0)}
          >
            <div className="dream-door">🚪</div>
            <div className="dream-stars">✦　✧　✦　✧　✦</div>
          </WorldScene>
        )}

        {places.map((place, index) =>
          scene === place.id ? (
            <WorldScene
              key={place.id}
              eyebrow={`DREAM ${index + 1} · ${place.label.toUpperCase()}`}
              title={<>{place.emoji} <br /><em>{place.label}</em></>}
              text={place.text}
              className={`${place.id}-scene destination-scene`}
              action={index === places.length - 1 ? "Follow the rain path" : "Open the next door"}
              onAction={nextPlace}
            >
              <div className="destination-marker">{place.emoji}</div>
              <div className="destination-door">🚪</div>
            </WorldScene>
          ) : null
        )}

        {scene === "comfort" && (
          <WorldScene
            key="comfort"
            eyebrow="WHEN THE WORLD FEELS A LITTLE LOUD"
            title={<>You can stay here<br /><em>for a while.</em></>}
            text="Rain outside. Warm light inside. No pressure to explain anything."
            className="comfort-scene"
            action="Go to the letters"
            onAction={() => setScene("letters")}
          >
            <div className="comfort-window">🌧️　🌧️　🌧️</div>
            <div className="comfort-home">🏡</div>
            <div className="comfort-teddy">🧸</div>
          </WorldScene>
        )}

        {scene === "letters" && (
          <motion.section
            key="letters"
            className="scene-inner letters-scene"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="eyebrow">THE LITTLE LETTER ROOM</p>
            <h2>Some words are better<br /><em>opened slowly.</em></h2>
            <div className="letter-row">
              {letters.map((item, index) => (
                <motion.button
                  key={item.title}
                  className="letter-card"
                  onClick={() => setLetter(index)}
                  whileHover={{ y: -10, rotate: index % 2 ? 2 : -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>💌</span>
                  <strong>{item.title}</strong>
                  <small>open me</small>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {letter !== null && (
                <motion.div
                  className="letter-modal"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button className="close-letter" onClick={() => setLetter(null)}>×</button>
                  <span>💌</span>
                  <h3>{letters[letter].title}</h3>
                  <p>{letters[letter].text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="ghost-button" onClick={() => setScene("sky")}>
              Continue into the night ✦
            </button>
          </motion.section>
        )}

        {scene === "sky" && (
          <WorldScene
            key="sky"
            eyebrow="THE SECRET SKY"
            title={<>Look up.<br /><em>There&apos;s still more.</em></>}
            text="Somewhere among these stars is one little secret."
            className="sky-scene"
            action="Find the hidden door"
            onAction={() => setScene("birthday")}
          >
            <div className="sky-stars-large">✦　·　✧　·　✦　·　✧　·　✦</div>
            <div className="secret-star">✦</div>
            <div className="secret-door">🔐</div>
          </WorldScene>
        )}

        {scene === "birthday" && (
          <motion.section
            key="birthday"
            className="scene-inner birthday-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="birthday-particles">✨ 🌷 ✨ 🦋 ✨ 🌷 ✨</div>
            <p className="eyebrow">23 · 11</p>
            <h2>Happy Birthday,<br /><em>SOFZZZZ.</em></h2>
            <p className="birthday-main">
              I didn&apos;t want to make you just a birthday page.
              <br />
              So I made you a little world.
            </p>
            <div className="birthday-card">
              <span>🎂</span>
              <p>
                This is only one chapter.
                <br />
                The door stays open.
              </p>
            </div>
            <button className="primary-button" onClick={() => setScene("meadow")}>
              Keep exploring <span>🌷</span>
            </button>
            <p className="still-counting">Still counting... ♾️</p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="world-footer">
        <span>May 11, 2026</span>
        <span>Still counting ♾️</span>
      </div>
    </main>
  );
}

function WorldScene({
  eyebrow,
  title,
  text,
  className,
  action,
  onAction,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
  className: string;
  action: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <motion.section
      className={`scene-inner cinematic-scene ${className}`}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 1.1 }}
    >
      <div className="scene-visual">{children}</div>
      <div className="scene-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="scene-text">{text}</p>
        <motion.button
          className="primary-button"
          onClick={onAction}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {action} <span>→</span>
        </motion.button>
      </div>
    </motion.section>
  );
}
