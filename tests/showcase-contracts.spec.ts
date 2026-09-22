import { expect, test } from "@playwright/test";

test.describe("five local showcase application contracts", () => {
  test("Sori supports bounded volume, mute restoration, output and quiet mode", async ({ page }) => {
    await page.goto("/software/sori");
    const slider = page.getByRole("slider", { name: "Music" });
    await slider.fill("42");
    await expect(slider).toHaveValue("42");
    const muteButton = page.getByRole("button", { name: /^(Mute|Unmute) Music$/ });
    await expect(muteButton).toHaveAttribute("aria-pressed", "false");
    await muteButton.click();
    await expect(muteButton).toHaveAttribute("aria-pressed", "true");
    await expect(slider).toHaveValue("0");
    await muteButton.click();
    await expect(muteButton).toHaveAttribute("aria-pressed", "false");
    await expect(slider).toHaveValue("42");
    await page.getByRole("combobox", { name: "Output device (example)" }).selectOption({ label: "Reading headphones" });
    await page.getByRole("checkbox", { name: /Quiet mode/ }).check();
    await expect(page.getByRole("checkbox", { name: /Quiet mode/ })).toBeChecked();
  });

  test("Namu creates, searches, edits, links and exports local notes", async ({ page }) => {
    await page.goto("/software/namu");
    await page.getByRole("textbox", { name: "New note title" }).fill("Korean 하루");
    await page.getByRole("textbox", { name: "New note body" }).fill("<literal> stays text");
    await page.getByRole("button", { name: "Create note" }).click();
    await expect(page.getByRole("button", { name: "Korean 하루" })).toBeVisible();
    await page.getByRole("textbox", { name: "Search notes" }).fill("하루");
    await expect(page.getByText("1 of 3 notes")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export Markdown" })).toBeVisible();
  });

  test("Namu refuses a ninth note without invalidating the current selection", async ({ page }) => {
    await page.goto("/software/namu");
    for (let index = 0; index < 6; index += 1) {
      await page.getByRole("textbox", { name: "New note title" }).fill(`Note ${index}`);
      await page.getByRole("button", { name: "Create note" }).click();
    }
    await expect(page.getByText("8 of 8 notes")).toBeVisible();
    await expect(page.locator("#namu-title")).toHaveValue("Note 5");
    await page.getByRole("textbox", { name: "New note title" }).fill("Note 9");
    await page.getByRole("button", { name: "Create note" }).click();
    await expect(page.getByText("This showcase keeps up to 8 notes.")).toBeVisible();
    await expect(page.getByText("8 of 8 notes")).toBeVisible();
    await expect(page.locator("#namu-title")).toHaveValue("Note 5");
  });

  test("Goyo uses a real remaining-time state and an explicit preview completion", async ({ page }) => {
    await page.goto("/software/goyo");
    await page.getByRole("button", { name: "5 min", exact: true }).click();
    await page.getByRole("checkbox", { name: /Quiet mode/ }).check();
    await page.getByRole("button", { name: "Start session" }).click();
    await expect(page.getByRole("button", { name: "Pause session" })).toBeVisible();
    await page.getByRole("button", { name: "Pause session" }).click();
    await expect(page.getByRole("button", { name: "Start session" })).toBeVisible();
    await page.getByRole("button", { name: "Start session" }).click();
    await expect(page.getByRole("button", { name: "Pause session" })).toBeVisible();
    await page.getByRole("button", { name: "Pause session" }).click();
    await expect(page.getByRole("button", { name: "Start session" })).toBeVisible();
    await expect(page.locator(".focus-state")).toContainText("Paused");
    await page.getByRole("button", { name: "Preview completion" }).click();
    await expect(page.locator(".focus-state")).toContainText("Session complete");
    await expect(page.locator(".focus-clock")).toHaveText("00:00");
    await expect(page.getByRole("checkbox", { name: /Quiet mode/ })).toBeChecked();
    await page.getByRole("button", { name: "Reset" }).last().click();
    await expect(page.locator(".focus-state")).toContainText("Choose a length");
    await expect(page.getByRole("checkbox", { name: /Quiet mode/ })).not.toBeChecked();
  });

  test("Haru Weather derives summary and table from location and period data", async ({ page }) => {
    await page.goto("/software/haru-weather");
    const table = page.getByRole("table");
    const morning = await table.innerText();
    await page.getByRole("button", { name: "Evening" }).click();
    await expect(table).not.toHaveText(morning);
    await expect(table).toContainText("Temperature");
    await expect(table).toContainText("17:00");
    await expect(table).toContainText("22:00");
    await page.getByRole("button", { name: "Afternoon" }).click();
    await expect(table).toContainText("12:00");
    await expect(table).toContainText("17:00");
    await expect(page.getByRole("combobox", { name: "Commute window" })).toBeVisible();
  });

  test("Dami derives totals and chart from the selected month", async ({ page }) => {
    await page.goto("/software/dami");
    const before = await page.locator(".dami-totals").innerText();
    await page.getByRole("button", { name: "August" }).click();
    await expect(page.locator(".dami-totals")).not.toHaveText(before);
    await expect(page.getByRole("table")).toContainText("Recurring");
    await page.getByLabel("Editable allocation").fill("0");
    await expect(page.getByLabel("Editable allocation")).toHaveAttribute("max", "2400");
    await expect(page.getByText("Remaining")).toBeVisible();
    await expect(page.locator(".dami-totals")).toContainText("$844.00");
  });
});
