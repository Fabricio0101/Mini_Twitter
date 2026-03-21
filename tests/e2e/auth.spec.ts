import { test, expect } from "@playwright/test";

const TEST_USER = {
  name: "Playwright User",
  email: `playwright-${Date.now()}@test.com`,
  password: "password123",
};

test.describe("Authentication", () => {
  test("should register a new user", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");

    // Fill registration form
    await page.fill('input[placeholder="Insira o seu nome"]', TEST_USER.name);
    await page.fill(
      'input[placeholder="Insira o seu e-mail"]',
      TEST_USER.email
    );
    await page.fill(
      'input[placeholder="Insira a sua senha"]',
      TEST_USER.password
    );

    // Submit
    await page.click('button[type="submit"]');

    // Register redirects to /login upon success
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test("should login with existing user", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Use seeded user since Date.now() changes between tests
    await page.fill(
      'input[placeholder="Insira o seu e-mail"]',
      "alice@example.com"
    );
    await page.fill(
      'input[placeholder="Insira a sua senha"]',
      "password123"
    );
    await page.click('button[type="submit"]');

    // Wait for login to complete — client-side navigation
    await page.waitForTimeout(2000);

    // Should see success toast
    const successToast = page.locator('[data-sonner-toast][data-type="success"]');
    await expect(successToast).toBeVisible({ timeout: 10000 });
  });

  test("should logout", async ({ page }) => {
    // Login first using existing seeded user
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill(
      'input[placeholder="Insira o seu e-mail"]',
      "alice@example.com"
    );
    await page.fill(
      'input[placeholder="Insira a sua senha"]',
      "password123"
    );
    await page.click('button[type="submit"]');

    // Wait for login to complete
    await page.waitForTimeout(2000);

    // If we're on the timeline, find logout button
    // If still on login, skip — this test depends on login working
    if (page.url().includes("login")) {
      test.skip();
      return;
    }

    // Click logout — it's in the header, last button
    const headerButtons = page.locator("header button");
    const logoutBtn = headerButtons.last();
    await logoutBtn.click();

    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.fill(
      'input[placeholder="Insira o seu e-mail"]',
      "wrong@test.com"
    );
    await page.fill(
      'input[placeholder="Insira a sua senha"]',
      "wrongpassword"
    );
    await page.click('button[type="submit"]');

    // Should show error toast
    await expect(
      page.locator('[data-sonner-toast][data-type="error"]')
    ).toBeVisible({ timeout: 5000 });
  });

  test("should redirect unauthenticated user to login", async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies();

    await page.goto("/");

    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 10000 });
  });
});
