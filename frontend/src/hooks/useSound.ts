import { useCallback, useRef } from "react";

const STORAGE_KEY = "typeshi-sound-enabled";

function getStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency: number, durationMs: number, volume: number) {
  if (!getStored()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(frequency + (Math.random() - 0.5) * 40, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {}
}

export function useSoundEnabled(): [boolean, (v: boolean) => void] {
  const ref = useRef(getStored());

  const setEnabled = useCallback((v: boolean) => {
    ref.current = v;
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {}
    if (v) {
      getAudioContext();
    }
  }, []);

  return [ref.current, setEnabled];
}

export function useSound() {
  const playClick = useCallback(() => {
    playTone(800, 30, 0.03);
  }, []);

  const playError = useCallback(() => {
    playTone(400, 40, 0.04);
  }, []);

  const playComplete = useCallback(() => {
    if (!getStored()) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, []);

  return { playClick, playError, playComplete };
}
