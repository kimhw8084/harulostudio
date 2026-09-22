export type BrandFrame = (now: number) => boolean;
export type BrandRegistration = {
  frame: BrandFrame;
  scroll?: () => void;
  resize?: () => void;
  visibility?: () => void;
  active: () => boolean;
};

/** One browser scheduler for every mounted scene. It is created only in an effect. */
class BrandScheduler {
  private registrations = new Set<BrandRegistration>();
  private frameId = 0;
  private dirty = false;
  private readonly onScroll = () => {
    this.registrations.forEach((item) => item.scroll?.());
    this.request();
  };
  private readonly onResize = () => {
    this.registrations.forEach((item) => item.resize?.());
    this.request();
  };
  private readonly onVisibility = () => {
    this.registrations.forEach((item) => item.visibility?.());
    if (!document.hidden) this.request();
  };

  constructor() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }
  register(item: BrandRegistration) {
    this.registrations.add(item);
    return () => {
      this.registrations.delete(item);
      if (!this.registrations.size && this.frameId) {
        cancelAnimationFrame(this.frameId);
        this.frameId = 0;
      }
    };
  }
  request() {
    this.dirty = true;
    if (!this.frameId && !document.hidden) this.frameId = requestAnimationFrame((now) => this.paint(now));
  }
  private paint(now: number) {
    this.frameId = 0;
    if (document.hidden) return;
    let animating = false;
    this.registrations.forEach((item) => {
      if (item.active() && item.frame(now)) animating = true;
    });
    this.dirty = false;
    if (animating || this.dirty) this.frameId = requestAnimationFrame((next) => this.paint(next));
  }
}

let scheduler: BrandScheduler | null = null;
export function getBrandScheduler() {
  if (typeof window === "undefined") return null;
  return (scheduler ??= new BrandScheduler());
}
