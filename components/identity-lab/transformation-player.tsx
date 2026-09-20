"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  poseAt,
  type Identity,
  type Transformation,
} from "@/lib/identity/geometry";
import { IdentityVector } from "./identity-vector";

type PlayerProps = {
  identity: Identity;
  transformation: Transformation;
  compact?: boolean;
};
export function TransformationPlayer(props: PlayerProps) {
  return (
    <Player key={`${props.identity}:${props.transformation.id}`} {...props} />
  );
}
function Player({ identity, transformation, compact = false }: PlayerProps) {
  const [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1);
  const [manualReduced, setManualReduced] = useState(false),
    [systemReduced, setSystemReduced] = useState(false),
    [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true),
    [pageVisible, setPageVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null),
    progressRef = useRef(0);
  const reduced = manualReduced || systemReduced;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSystemReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    const frame = requestAnimationFrame(() => {
      setReady(true);
      sync();
    });
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.08 },
    );
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    if (stage.current) observer.observe(stage.current);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced || !inView || !pageVisible) return;
    let frame = 0,
      previous = 0,
      painted = 0;
    const tick = (now: number) => {
      const delta = previous ? Math.min(now - previous, 80) : 0;
      previous = now;
      if (!document.hidden) {
        progressRef.current = Math.min(
          1,
          progressRef.current + (delta * speed) / transformation.duration,
        );
        if (now - painted > 30 || progressRef.current === 1) {
          setProgress(progressRef.current);
          painted = now;
        }
        if (progressRef.current === 1) {
          setPlaying(false);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced, speed, transformation.duration, inView, pageVisible]);
  const seek = (p: number) => {
    setPlaying(false);
    progressRef.current = p;
    setProgress(p);
  };
  const play = () => {
    if (progressRef.current >= 1) seek(0);
    setPlaying((v) => !v);
  };
  const replay = () => {
    progressRef.current = 0;
    setProgress(0);
    setPlaying(!reduced);
  };
  const pose = poseAt(transformation, progress);
  return (
    <div
      className={`transformation-player ${compact ? "compact-player" : ""}`}
      data-playing={playing}
      data-progress={progress.toFixed(3)}
    >
      <div className="transformation-stage" ref={stage}>
        <div className="stage-top">
          <span>
            {transformation.id} / {transformation.purpose}
          </span>
          <span>
            {reduced ? "STATIC INSPECTION" : "CONTINUOUS VECTOR STUDY"}
          </span>
        </div>
        <IdentityVector
          identity={identity}
          pose={pose}
          label={`${transformation.name} — ${Math.round(progress * 100)} percent`}
        />
        <div className="stage-bottom">
          <span>{pose.caption ?? "HARULO STUDIO / 하루로"}</span>
          <span>{pose.detail ?? "INDEPENDENT SOFTWARE PUBLISHER"}</span>
        </div>
      </div>
      <div className="player-console">
        <div className="player-timeline">
          <Slider
            aria-label="Transformation timeline"
            value={[progress * 100]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(v) => seek(v[0] / 100)}
            disabled={!ready}
          />
          <output>
            {Math.round(progress * 100)
              .toString()
              .padStart(3, "0")}
            %
          </output>
        </div>
        <div className="player-controls">
          <Button
            onClick={play}
            disabled={!ready || reduced}
            aria-label={
              playing ? "Pause transformation" : "Play transformation"
            }
          >
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            onClick={replay}
            disabled={!ready}
            aria-label="Replay transformation"
          >
            <RotateCcw />
            Replay
          </Button>
          <label className="speed-control">
            <span>Speed</span>
            <NativeSelect
              aria-label="Playback speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <NativeSelectOption value="1">1×</NativeSelectOption>
              <NativeSelectOption value="0.5">0.5×</NativeSelectOption>
              <NativeSelectOption value="0.25">0.25×</NativeSelectOption>
            </NativeSelect>
          </label>
          <label className="reduced-control">
            <Switch
              checked={reduced}
              onCheckedChange={(value) => {
                setManualReduced(value);
                if (value) setPlaying(false);
              }}
              disabled={systemReduced}
              aria-label="Reduced-motion preview"
            />
            <span>Reduced motion{systemReduced ? " · system" : ""}</span>
          </label>
        </div>
        <div className="player-keyframes" aria-label="Compositional states">
          {transformation.frames
            .filter((f, i, all) => i === 0 || f.pose !== all[i - 1].pose)
            .map((f, i) => (
              <Button
                key={f.at}
                variant="ghost"
                size="sm"
                onClick={() => seek(f.at)}
                disabled={!ready}
              >
                State {i + 1}
                <span>{Math.round(f.at * 100)}%</span>
              </Button>
            ))}
        </div>
        {reduced && (
          <p className="player-note">
            Motion is off. Use the states or timeline to inspect the same
            compositions without animation.
          </p>
        )}
      </div>
    </div>
  );
}
