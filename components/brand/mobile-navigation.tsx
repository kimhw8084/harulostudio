"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HaruloMark, HaruloLockup } from "./harulo-mark";
import { Direction } from "@/components/publisher-mark";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-navigation">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="mobile-menu-trigger">
          <HaruloMark /> <span>Menu</span>
        </DialogTrigger>
        <DialogContent className="harulo-mobile-dialog">
          <HaruloLockup />
          <DialogTitle>Where next?</DialogTitle>
          <DialogDescription>
            Independent software. A little better, every day.
          </DialogDescription>
          <nav aria-label="Mobile navigation">
            {["Software", "Studio", "Press", "Privacy"].map(
              (label, i) => (
                <a href={`/${label.toLowerCase()}`} key={label}>
                  <span className="metadata">0{i + 1}</span>
                  {label}
                  <Direction />
                </a>
              ),
            )}
          </nav>
          <p lang="ko">조금 더 나은 하루로.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
