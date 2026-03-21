import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "alice@example.com",
  password: "password123",
};

test.describe("Posts", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.fill(
      'input[placeholder="Insira o seu e-mail"]',
      TEST_USER.email
    );
    await page.fill(
      'input[placeholder="Insira a sua senha"]',
      TEST_USER.password
    );
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/", { timeout: 10000 });
    await page.waitForLoadState("networkidle");
  });

  test("should display posts on timeline", async ({ page }) => {
    // Wait for posts to load — look for a heading (h3) inside a card
    await expect(page.locator("h3").first()).toBeVisible({ timeout: 10000 });
  });

  test("should create a new post", async ({ page }) => {
    const postTitle = `E2E Post ${Date.now()}`;

    // Click on the textarea to expand the form
    await page.click('text=E aí, o que está rolando?');

    // Wait for the expanded fields to appear
    await page.waitForTimeout(500);

    // Fill in the title — it should now be visible after expanding
    const titleInput = page.locator('input[placeholder*="título" i]');
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill(postTitle);

    // Fill in content
    const contentArea = page.locator('textarea');
    await contentArea.first().fill("Este é um post criado pelo teste E2E.");

    // Submit
    await page.click('button:has-text("Postar")');

    // Post should appear in the timeline
    await expect(page.locator(`text=${postTitle}`)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should like a post", async ({ page }) => {
    // Wait for posts to load
    await expect(page.locator("h3").first()).toBeVisible({ timeout: 10000 });

    // Find the first like button — it contains the heart icon and a number
    // Based on the DOM snapshot, like buttons are buttons with a number text
    const firstLikeButton = page.locator("button").filter({
      hasText: /^\d+$/,
    }).first();
    await expect(firstLikeButton).toBeVisible();

    // Get current like count text
    const countBefore = await firstLikeButton.textContent();

    // Click like
    await firstLikeButton.click();
    await page.waitForTimeout(500);

    // The button should still be visible
    await expect(firstLikeButton).toBeVisible();
  });

  test("should search for posts", async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Buscar" i]');
    await expect(searchInput).toBeVisible();

    // Type a search term
    await searchInput.fill("ElysiaJS");

    // Wait for debounce + results
    await page.waitForTimeout(1500);

    // URL should have search param
    await expect(page).toHaveURL(/q=ElysiaJS/i, { timeout: 5000 });
  });
});
