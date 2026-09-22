import { expect, test } from "@playwright/test";

test.describe("five local showcase application contracts", () => {
  test("Sori supports bounded volume, mute restoration, output and quiet mode", async ({ page }) => {
    await page.goto("/software/sori");
    const slider = page.getByRole("slider", { name: "Music" });
    await slider.fill("42");
    await expect(slider).toHaveValue("42");
    await page.getByRole("button", { name: "Mute Music" }).click();
    await page.getByRole("button", { name: "Unmute Music" }).click();
    await expect(slider).not.toHaveValue("0");
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

  test("Goyo uses a real remaining-time state and an explicit preview completion", async ({ page }) => {
    await page.goto("/software/goyo");
    await page.getByRole("button", { name: "5 min", exact: true }).click();
    await expect(page.getByRole("button", { name: "Start session" })).toBeVisible();
    await page.getByRole("button", { name: "Preview completion" }).click();
    await expect(page.locator(".focus-state")).toContainText("Session complete");
    await page.getByRole("button", { name: "Reset" }).last().click();
    await expect(page.locator(".focus-state")).toContainText("Choose a length");
  });

  test("Haru Weather derives summary and table from location and period data", async ({ page }) => {
    await page.goto("/software/haru-weather");
    const table = page.getByRole("table");
    const morning = await table.innerText();
    await page.getByRole("button", { name: "Evening" }).click();
    await expect(table).not.toHaveText(morning);
    await expect(table).toContainText("Temperature");
    await expect(page.getByRole("combobox", { name: "Commute window" })).toBeVisible();
  });

  test("Dami derives totals and chart from the selected month", async ({ page }) => {
    await page.goto("/software/dami");
    const before = await page.locator(".dami-totals").innerText();
    await page.getByRole("button", { name: "August" }).click();
    await expect(page.locator(".dami-totals")).not.toHaveText(before);
    await expect(page.getByRole("table")).toContainText("Recurring");
    await page.getByLabel("Editable allocation").fill("0");
    await expect(page.getByText("Remaining")).toBeVisible();
  });
});
