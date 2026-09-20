"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperience } from "./experience-provider";
export function CopyEmail({ email }: { email: string }) {
  const { ready } = useExperience();
  const [state, setState] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );
  const pending = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function copy() {
    if (pending.current) return;
    pending.current = true;
    setState("copying");
    try {
      await navigator.clipboard.writeText(email);
      if (mounted.current) setState("copied");
    } catch {
      if (mounted.current) setState("error");
    } finally {
      pending.current = false;
    }
  }
  return (
    <div className="copy-row">
      <Button
        type="button"
        variant="ghost"
        className="copy-button control-button"
        onClick={copy}
        disabled={!ready || state === "copying"}
      >
        {state === "copied" ? (
          <Check aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {state === "copying" ? "Copying…" : "Copy email"}
      </Button>
      <p role="status" aria-live="polite" className="copy-status">
        {state === "copied"
          ? "Email copied."
          : state === "error"
            ? "Couldn’t copy. Select the address above, or open your email app."
            : ""}
      </p>
    </div>
  );
}
