import { expect, test } from "@playwright/test";

test.describe("Publication Genesis normal-motion state machine", () => {
  test("opens, switches, closes, and returns focus without stranding the panel", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "chromium-reduced", "This regression intentionally exercises CSS transitions.");
    await page.goto("/");
    const trigger = page.locator(".genesis-toggle");
    const panel = page.locator(".genesis-interface");
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(panel.getByRole("tab", { name: "Namu" })).toBeEnabled();
    await panel.getByRole("tab", { name: "Namu" }).click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "open");
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-product", "namu");
    await page.keyboard.press("Escape");
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "resting");
    await expect(trigger).toBeFocused();
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  test("latest open/close intent wins during an active transition", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "chromium-reduced", "This regression intentionally exercises CSS transitions.");
    await page.goto("/");
    const trigger = page.locator(".genesis-toggle");
    const panel = page.locator(".genesis-interface");
    await trigger.click();
    await trigger.click();
    await expect(page.locator(".genesis-stage")).toHaveAttribute("data-phase", "resting");
    await expect(panel).toHaveAttribute("aria-hidden", "true");
  });
});
