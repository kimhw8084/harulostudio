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
import { liveCatalog, publicNavigation } from "@/lib/publishing/catalog";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const navigation = publicNavigation(liveCatalog);
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
            {navigation.concat({ label: "Privacy", href: "/privacy" }).map(
              (item, i) => (
                <a href={item.href} key={item.href}>
                  <span className="metadata">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
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
