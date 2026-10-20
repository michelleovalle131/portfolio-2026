import { useEffect, useState } from "react";
import styles from "./LocalTime.module.css";

const CHICAGO_TZ = "America/Chicago";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=41.88&longitude=-87.63&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit";
const WEATHER_REFRESH_MS = 15 * 60_000;
/** How long the line waits for the weather before showing without it */
const WEATHER_WAIT_MS = 1200;
const WEATHER_CACHE_KEY = "chicago-weather";
const WEATHER_CACHE_MAX_AGE_MS = 60 * 60_000;

type Weather = { emoji: string; temp: string };

/** The last reading, if recent — so a return visit shows the full line at once */
function cachedWeather(): Weather | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(WEATHER_CACHE_KEY) ?? "null");
    if (saved && Date.now() - saved.at < WEATHER_CACHE_MAX_AGE_MS) return saved.weather;
  } catch {
    /* storage unavailable or malformed */
  }
  return null;
}

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
  const [weather, setWeather] = useState<Weather | null>(cachedWeather);
  // The line holds back until the weather is in (or the wait runs out), so
  // it appears whole instead of the weather arriving later
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setWaited(true), WEATHER_WAIT_MS);
    return () => window.clearTimeout(id);
  }, []);

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
          const next = {
            emoji: weatherEmoji(current.weather_code, current.is_day === 1),
            temp: `${Math.round(current.temperature_2m)}°`,
          };
          setWeather(next);
          try {
            window.localStorage.setItem(
              WEATHER_CACHE_KEY,
              JSON.stringify({ at: Date.now(), weather: next }),
            );
          } catch {
            /* storage unavailable */
          }
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

  return { time, weather, ready: weather !== null || waited };
}

/** "Chicago, IL 3:30pm ☁️ 62°" — live local time and weather. The host
 * passes the type styling via className. */
export function LocalTime({ className }: { className?: string }) {
  const { time, weather, ready } = useChicagoNow();

  return (
    <p className={[className, styles.line, ready ? styles.ready : ""].filter(Boolean).join(" ")}>
      Chicago, IL{" "}
      <span className={styles.visuallyHidden}>local time </span>
      {time}
      {weather && (
        <>
          {" "}
          <span className={styles.weatherEmoji}>{weather.emoji}</span>{" "}
          {weather.temp}
        </>
      )}
    </p>
  );
}
