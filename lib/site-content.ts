/** Public content is centralized here; design tokens live in globals.css. */
export const studio = {
  name: "Harulo Studio",
  koreanName: "하루로",
  email: "harulostudio@gmail.com",
  domain: "harulostudio.com",
  url: "https://harulostudio.com",
  github: "https://github.com/kimhw8084/harulostudion",
  role: "Independent software publisher",
  tagline: "A little better, every day.",
  koreanTagline: "조금 더 나은 하루로.",
  description:
    "We design, build, publish and maintain thoughtful software for the small moments that make up a day.",
  boilerplate:
    "Harulo Studio is an independent software publisher. Its tools begin with ordinary routines and a simple question: what could make someone’s day a little better?",
  principles: [
    {
      number: "01",
      title: "Start with something useful.",
      body: "A small, familiar frustration is a good place to begin. Find the thing that could work a little better.",
    },
    {
      number: "02",
      title: "Make space for simple.",
      body: "Give every screen a clear purpose. Keep the path from wanting to do something to doing it a little shorter.",
    },
    {
      number: "03",
      title: "Care about the small things.",
      body: "The way a button feels. The words that help. The details you return to, day after day.",
    },
  ],
} as const;
