import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import styles from "./StampBadge.module.css";

const WORDS = ["design", "with", "heart", "and", "mind"];
const MAX_PRINTS = 30;
const KEY_STEP = 24;
const MAX_TILT = 16; // degrees either way the block turns between presses
const SLOT_MARGIN = 16; // px around its spot that still counts as "put back"

const randomTilt = () => (Math.random() * 2 - 1) * MAX_TILT;

type Print = { id: number; x: number; y: number; rotate: number; ink: number };

type StampBadgeProps = {
  /** The hero section — the stamp can be carried and printed anywhere in it */
  areaRef: RefObject<HTMLElement | null>;
  /** Grid placement and resting tilt from the hero */
  className?: string;
};

/**
 * "Design with heart and mind" as a lino block. Hover floods it with ink
 * (reversed, letters knocked out). Click to pick it up: it follows the pointer
 * around the hero, and each click prints an impression there at the block's
 * angle, after which the block turns (up to ±16°) for the next press. Esc,
 * or a click on or near its empty spot, puts it down.
 * Keyboard: Enter picks up, arrows move, Enter prints, Esc puts down.
 */
export function StampBadge({ areaRef, className }: StampBadgeProps) {
  const filterId = `stamp-grain-${useId().replace(/:/g, "")}`;
  const homeRef = useRef<HTMLButtonElement>(null);
  const [held, setHeld] = useState(false);
  // Carrying the block over (or near) its slot: the slot invites the drop
  const [overSlot, setOverSlot] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [prints, setPrints] = useState<Print[]>([]);
  // Has this pick-up printed yet? Until it has, the hints say how to stamp
  const [printedThisHold, setPrintedThisHold] = useState(false);
  // The block's angle in hand; it prints at this angle, then turns slightly
  const [tilt, setTilt] = useState(-2);
  const tiltRef = useRef(tilt);
  tiltRef.current = tilt;
  const nextId = useRef(0);
  const posRef = useRef(pos);
  posRef.current = pos;

  const homeCenter = useCallback(() => {
    const area = areaRef.current?.getBoundingClientRect();
    const home = homeRef.current?.getBoundingClientRect();
    if (!area || !home) return null;
    return { x: home.left - area.left + home.width / 2, y: home.top - area.top + home.height / 2 };
  }, [areaRef]);

  const pickUp = (fromKeyboard: boolean) => {
    const home = homeRef.current;
    if (!home) return;
    setSize({ w: home.offsetWidth, h: home.offsetHeight });
    setHeld(true);
    setPrintedThisHold(false);
    // A keyboard pick-up starts the stamp just above its spot
    if (fromKeyboard) {
      const c = homeCenter();
      if (c) setPos({ x: c.x, y: c.y - home.offsetHeight * 2 });
    }
  };

  const putDown = useCallback(() => {
    setHeld(false);
    setOverSlot(false);
    setPos(null);
    homeRef.current?.focus();
  }, []);

  const print = useCallback((at: { x: number; y: number }) => {
    setPrints((list) =>
      [
        ...list,
        {
          id: nextId.current++,
          x: at.x,
          y: at.y,
          rotate: tiltRef.current,
          ink: 0.78 + Math.random() * 0.2,
        },
      ].slice(-MAX_PRINTS),
    );
    setTilt(randomTilt());
    setPrintedThisHold(true);
  }, []);

  // While held: follow the pointer, print on click, block the page's own clicks
  useEffect(() => {
    const area = areaRef.current;
    if (!held || !area) return;
    area.dataset.stamping = "true";

    const local = (e: PointerEvent | MouseEvent) => {
      const r = area.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const nearSlot = (x: number, y: number) => {
      const slot = homeRef.current?.getBoundingClientRect();
      return (
        !!slot &&
        x >= slot.left - SLOT_MARGIN &&
        x <= slot.right + SLOT_MARGIN &&
        y >= slot.top - SLOT_MARGIN &&
        y <= slot.bottom + SLOT_MARGIN
      );
    };
    const onMove = (e: PointerEvent) => {
      setPos(local(e));
      setOverSlot(nearSlot(e.clientX, e.clientY));
    };
    const onLeave = () => setPos(null);
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      // On its slot: leave it to the slot's own click, which puts it away
      // (putting it down here would let that click pick it straight back up)
      if (homeRef.current?.contains(e.target as Node)) return;
      // Close enough to its slot: put it away
      if (nearSlot(e.clientX, e.clientY)) {
        putDown();
        return;
      }
      const at = local(e);
      setPos(at);
      print(at);
    };
    // Swallow the click that follows, so links and buttons don't fire —
    // except the slot itself, whose click puts the stamp away
    const onClick = (e: MouseEvent) => {
      if (homeRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        putDown();
        return;
      }
      const p = posRef.current ?? homeCenter();
      if (!p) return;
      const r = area.getBoundingClientRect();
      const move = (dx: number, dy: number) => {
        e.preventDefault();
        setPos({
          x: Math.min(Math.max(p.x + dx, 0), r.width),
          y: Math.min(Math.max(p.y + dy, 0), r.height),
        });
      };
      if (e.key === "ArrowLeft") move(-KEY_STEP, 0);
      else if (e.key === "ArrowRight") move(KEY_STEP, 0);
      else if (e.key === "ArrowUp") move(0, -KEY_STEP);
      else if (e.key === "ArrowDown") move(0, KEY_STEP);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        print(p);
      }
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    area.addEventListener("pointerdown", onDown, true);
    area.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      delete area.dataset.stamping;
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      area.removeEventListener("pointerdown", onDown, true);
      area.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [held, areaRef, putDown, print, homeCenter]);

  const words = WORDS.map((w) => <span key={w}>{w}</span>);
  const area = areaRef.current;
  const touch = typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches;
  // Until the first press, the empty slot says how to stamp
  const slotHint = `${touch ? "Tap" : "Click"} anywhere to stamp`;

  return (
    <>
      <button
        ref={homeRef}
        type="button"
        className={[
          className,
          styles.block,
          held ? styles.lifted : "",
          held && overSlot ? styles.dropTarget : "",
          held && printedThisHold ? styles.printed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-ink="float"
        aria-pressed={held}
        aria-label={
          held
            ? "Stamp picked up. Click or press Enter to print, arrow keys to move, Escape to put it down"
            : "Design with heart and mind — pick up the stamp"
        }
        onClick={(e) => {
          if (held) putDown();
          else pickUp(e.detail === 0);
        }}
      >
        {words}
        {held && !printedThisHold && (
          <span className={styles.slotHint} aria-hidden>
            {slotHint}
          </span>
        )}
      </button>

      {area &&
        createPortal(
          <div className={styles.layer} aria-hidden>
            <svg className={styles.defs} width="0" height="0">
              <filter id={filterId}>
                {/* Mostly solid ink, with light specks where the "paper" shows */}
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
                <feColorMatrix
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.6"
                />
                <feComposite in="SourceGraphic" operator="in" />
              </filter>
            </svg>

            {prints.map((p) => (
              <div
                key={p.id}
                className={`${styles.reversed} ${styles.print}`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: size.w || undefined,
                  height: size.h || undefined,
                  rotate: `${p.rotate}deg`,
                  opacity: p.ink,
                  filter: `url(#${filterId})`,
                }}
              >
                {words}
              </div>
            ))}

            {held && pos && (
              <div
                className={`${styles.reversed} ${styles.held}`}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: size.w,
                  height: size.h,
                  rotate: `${tilt}deg`,
                }}
              >
                {words}
              </div>
            )}
          </div>,
          area,
        )}
    </>
  );
}
