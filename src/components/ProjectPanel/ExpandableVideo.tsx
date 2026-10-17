import { useRef, type VideoHTMLAttributes } from "react";
import styles from "./ExpandableVideo.module.css";

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * A video for the project panel with an "Expand" button in its corner that
 * opens it full screen (the browser's own player, so it can be paused,
 * scrubbed and closed with Esc). Bleeds to the panel's full width.
 */
export function ExpandableVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<FullscreenVideo>(null);

  const expand = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) void video.requestFullscreen().catch(() => {});
    else video.webkitEnterFullscreen?.(); // iOS Safari
  };

  return (
    <div className={styles.frame} data-bleed>
      <video ref={videoRef} className={styles.video} {...props} />
      <button type="button" className={styles.expand} onClick={expand} aria-label="Expand video to full screen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
