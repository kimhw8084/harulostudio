"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExperience } from "@/components/experience-provider";
import { ease, motion } from "@/lib/brand/motion";

export function useBrandTransition(open: boolean) {
  const { paused, reduced } = useExperience();
  const ref = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(open ? 1 : 0);
  const value = useRef(open ? 1 : 0);
  useEffect(() => {
    let frame = 0;
    const from = value.current,
      to = open ? 1 : 0;
    let started = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      value.current = to;
      setAmount(to);
    };
    const tick = (time: number) => {
      if (paused || reduced || document.hidden) {
        finish();
        return;
      }
      if (!started) started = time;
      const p = Math.min(
        1,
        (time - started) / (open ? motion.open : motion.collapse),
      );
      value.current = from + (to - from) * ease(p);
      setAmount(value.current);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (ref.current)
        ref.current.dataset.inView = String(entry.isIntersecting);
      if (!entry.isIntersecting) finish();
    });
    if (ref.current) observer.observe(ref.current);
    const visibility = () => {
      if (document.hidden) finish();
    };
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [open, paused, reduced]);
  return { ref, amount };
}

/** A finite player: no animation work offscreen, in hidden tabs, or when paused. */
export function useBrandMotion(duration: number = motion.study) {
  const { paused, reduced } = useExperience();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [slow, setSlow] = useState(false);
  const position = useRef(0);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (ref.current) observer.observe(ref.current);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || paused || reduced || !visible || hidden) return;
    let frame = 0,
      last = 0;
    const tick = (time: number) => {
      if (last)
        position.current = Math.min(
          1,
          position.current +
            Math.min(time - last, 64) / (duration * (slow ? 3 : 1)),
        );
      last = time;
      setProgress(position.current);
      if (position.current < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, paused, reduced, visible, hidden, duration, slow]);
  const seek = useCallback((value: number) => {
    position.current = value;
    setProgress(value);
    setPlaying(false);
  }, []);
  const play = useCallback(() => {
    if (paused || reduced) {
      seek(0.54);
      return;
    }
    if (position.current >= 1) {
      position.current = 0;
      setProgress(0);
    }
    setPlaying(true);
  }, [paused, reduced, seek]);
  const replay = useCallback(() => {
    position.current = 0;
    setProgress(0);
    if (paused || reduced) seek(0.54);
    else setPlaying(true);
  }, [paused, reduced, seek]);
  return {
    ref,
    progress,
    playing: playing && visible && !hidden && !paused && !reduced,
    paused,
    reduced,
    slow,
    setSlow,
    play,
    replay,
    seek,
    pause: () => setPlaying(false),
  };
}
