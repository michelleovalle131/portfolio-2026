import { useEffect, useState } from "react";
import styles from "./IntroSection.module.css";

const PORTRAIT_SRC = "/imgs/intro-portrait.jpg";

const CHICAGO_TZ = "America/Chicago";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=41.88&longitude=-87.63&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit";
const WEATHER_REFRESH_MS = 15 * 60_000;

/** "3:30pm" in Chicago time. */
function chicagoTime(now: Date): string {
  return now
    .toLocaleTimeString("en-US", {
      timeZone: CHICAGO_TZ,
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/\s/g, "")
    .toLowerCase();
}

/** WMO weather code → emoji (https://open-meteo.com/en/docs). */
function weatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code === 1) return isDay ? "🌤️" : "🌙";
  if (code === 2) return isDay ? "⛅" : "☁️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return isDay ? "🌦️" : "🌧️"; // drizzle
  if (code >= 61 && code <= 67) return "🌧️"; // rain / freezing rain
  if (code >= 71 && code <= 77) return "🌨️"; // snow
  if (code >= 80 && code <= 82) return isDay ? "🌦️" : "🌧️"; // showers
  if (code === 85 || code === 86) return "🌨️"; // snow showers
  if (code >= 95) return "⛈️"; // thunderstorm
  return isDay ? "🌤️" : "🌙";
}

function useChicagoNow() {
  const [time, setTime] = useState(() => chicagoTime(new Date()));
  const [weather, setWeather] = useState<{ emoji: string; temp: string } | null>(
    null,
  );

  useEffect(() => {
    const id = window.setInterval(() => setTime(chicagoTime(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = () =>
      fetch(WEATHER_URL, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const current = data?.current;
          if (!current) return;
          setWeather({
            emoji: weatherEmoji(current.weather_code, current.is_day === 1),
            temp: `${Math.round(current.temperature_2m)}°`,
          });
        })
        // Weather is decorative — keep the last reading (or just the clock) on failure
        .catch(() => {});
    load();
    const id = window.setInterval(load, WEATHER_REFRESH_MS);
    return () => {
      window.clearInterval(id);
      controller.abort();
    };
  }, []);

  return { time, weather };
}

export function IntroSection() {
  const { time, weather } = useChicagoNow();

  return (
    <section className={styles.section} id="intro" aria-labelledby="intro-heading">
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden>
          01/03
        </p>

        <p className={styles.local}>
          <span className={styles.visuallyHidden}>Local time in Chicago: </span>
          {time}
          {weather && (
            <>
              {" "}
              <span className={styles.weatherEmoji}>{weather.emoji}</span>{" "}
              {weather.temp}
            </>
          )}
        </p>

        <h2 className={styles.headline} id="intro-heading">
          Hello from Chicago. I&apos;m Michelle—an experienced Product Designer
          who thrives at the intersection of systems thinking, craft, and
          making a real impact.
        </h2>

        <div className={styles.body}>
          <p>
            I love untangling ambiguous problems, partnering closely with my
            cross-functional peers, and staying curious as design tools and
            practices keep evolving.
          </p>
          <p>
            Right now, I&apos;m helping teams do their best work on{" "}
            <a
              className={styles.inlineLink}
              href="https://www.loom.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Loom
            </a>{" "}
            at{" "}
            <a
              className={styles.inlineLink}
              href="https://www.atlassian.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian
            </a>
            .
          </p>
        </div>

        <div className={styles.portrait}>
          <img
            className={styles.portraitImg}
            src={PORTRAIT_SRC}
            alt="Michelle smiling at her desk"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
