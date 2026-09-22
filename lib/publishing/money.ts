/** Display values are dollars; the publication model stores integer cents. */
export const dollarsToCents = (value: number) => Math.round(value * 100);
export const centsToDollars = (value: number) => value / 100;
