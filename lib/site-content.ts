/** Public content is centralized here; design tokens live in globals.css. */
export const studio = {
  name: "Harulo Studio",
  koreanName: "하루로",
  email: "harulostudio@gmail.com",
  domain: "harulostudio.com",
  tagline: "A little better, every day.",
  koreanTagline: "조금 더 나은 하루로.",
  description: "An independent software studio with a simple aim: make the everyday a little easier.",
  principles: [
    { number: "01", title: "Start with something useful.", body: "A small, familiar frustration is a good place to begin. Find the thing that could work a little better." },
    { number: "02", title: "Make space for simple.", body: "Give every screen a clear purpose. Keep the path from wanting to do something to doing it a little shorter." },
    { number: "03", title: "Care about the small things.", body: "The way a button feels. The words that help. The details you return to, day after day." },
  ],
} as const;
