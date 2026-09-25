import { expect, test } from "@playwright/test";

test("inspection is secondary and leaves Sori controls usable", async ({ page }) => {
  await page.goto("/software/sori");
  const xray = page.locator(".software-xray");
  const disclosure = xray.locator(".xray-inspection");
  const slider = xray.getByRole("slider", { name: "Music" });
  await expect(disclosure).not.toHaveAttribute("open", "");
  await slider.fill("42");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(xray.getByRole("tab")).toHaveCount(4);
  await xray.getByRole("tab", { name: "Keyboard" }).click();
  await expect(xray.locator(".xray-badges span").first()).toBeVisible();
  await expect(xray.locator(".xray-reading")).toContainText("Mute Music");
  await expect(xray.locator(".xray-badges")).toHaveCSS("pointer-events", "none");
  await xray.getByRole("button", { name: "Mute Music" }).click();
  await expect(xray.locator(".xray-reading")).toContainText("Unmute Music");
  await expect(slider).toHaveValue("0");
  await xray.getByRole("button", { name: "Unmute Music" }).click();
  await expect(slider).toHaveValue("42");
  await xray.getByRole("tab", { name: "Accessibility" }).click();
  await expect(xray.locator(".xray-reading")).toContainText("Semantic groups");
  for (const name of ["Channels", "Output", "Quiet mode"]) {
    await expect(xray.getByRole("group", { name, exact: true })).toBeVisible();
    await expect(xray.locator(".xray-reading")).toContainText(name);
  }
  await xray.getByRole("tab", { name: "Data boundary" }).click();
  await expect(xray.locator(".xray-reading")).toContainText("channel.level and channel.muted");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(xray.getByRole("tab", { name: "Data boundary" })).toHaveAttribute("data-state", "active");
  await disclosure.locator("summary").click();
  await expect(slider).toHaveValue("42");
});

test("native inspection summary responds to Space and Enter without resetting the specimen", async ({ page }) => {
  await page.goto("/software/sori");
  const disclosure = page.locator(".xray-inspection");
  const summary = disclosure.locator("summary");
  await page.getByRole("slider", { name: "Music" }).fill("37");
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.getByRole("tab")).toHaveCount(4);
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(page.getByRole("slider", { name: "Music" })).toHaveValue("37");
});

for (const [slug, groups, statePath] of [
  ["sori", ["Channels", "Output", "Quiet mode"], "channel.level and channel.muted"],
  ["namu", ["Library", "Editor", "Relationships", "Creation"], "Selected note title or body"],
  ["goyo", ["Intention", "Duration", "Clock and status", "Actions"], "Session phase and deadline"],
  ["haru-weather", ["Location", "Period", "Commute", "Forecast"], "Selected forecast points"],
  ["dami", ["Totals", "Planning inputs", "Ledger", "Chart"], "Integer-cent allocation"],
] as const) {
  test(`${slug} inspection names real groups and local state`, async ({ page }) => {
    await page.goto(`/software/${slug}`);
    const xray = page.locator(".software-xray");
    await xray.locator(".xray-inspection > summary").click();
    await xray.getByRole("tab", { name: "Accessibility" }).click();
    for (const name of groups) {
      await expect(xray.getByRole("group", { name, exact: true })).toBeVisible();
      await expect(xray.locator(".xray-reading")).toContainText(name);
    }
    await xray.getByRole("tab", { name: "Data boundary" }).click();
    await expect(xray.locator(".xray-reading")).toContainText(statePath);
  });
}
