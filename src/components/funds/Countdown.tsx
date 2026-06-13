import { useEffect, useRef, useState } from "react";

interface CountdownProps {
  /** Unix seconds when the timer elapses */
  availableAt: number;
  /** Called once when the countdown reaches zero */
  onElapsed?: () => void;
}

function formatRemaining(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function Countdown({ availableAt, onElapsed }: CountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, availableAt - Date.now() / 1000),
  );
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const tick = () => {
      const left = Math.max(0, availableAt - Date.now() / 1000);
      setRemaining(left);
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onElapsed?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onElapsed identity changes must not restart the timer
  }, [availableAt]);

  if (remaining <= 0) {
    return <span className="text-xs text-muted-foreground">Finalizing…</span>;
  }

  return (
    <span className="font-mono text-xs tabular-nums text-amber-400">
      {formatRemaining(remaining)}
    </span>
  );
}
