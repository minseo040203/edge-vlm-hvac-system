import { expect, test } from "@playwright/test";

test("Feature flag dashboard renders and tracks experiment flow", async ({ page }) => {
  await page.goto("/?user=minseo040203&role=admin&region=KR");

  await expect(
    page.getByRole("heading", { name: "Edge VLM HVAC System" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "현재 사용자" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Feature Flags" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "A/B Test Assignments" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Admin 사용자" }).click();

  await expect(
    page.getByRole("button", { name: "Admin 사용자" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Operator 사용자" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Guest 사용자" })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Experiment Event Log" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "로그 초기화" })
  ).toBeVisible();
});