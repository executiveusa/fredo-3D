/**
 * Audio architecture slot (decision Q6: wired for sound, launched silent).
 * When per-chapter audio assets exist, list them here; a mute-by-default
 * toggle then renders. With no assets (current state) this renders nothing,
 * ships no audio bytes, and adds zero UI.
 */
export const chapterAudio: Record<string, string> = {
  // "threshold": "/audio/threshold.mp3",
};

export default function SoundSlot({ chapter }: { chapter: string }) {
  const src = chapterAudio[chapter];
  if (!src) return null;
  // Muted by default; user opt-in only. Never autoplay with sound.
  return (
    <audio preload="none" muted loop aria-hidden="true">
      <source src={src} type="audio/mpeg" />
    </audio>
  );
}
