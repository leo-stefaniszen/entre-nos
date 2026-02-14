import { test, expect } from '@playwright/test';

test('mobile layout keeps single column and toggles navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  await expect(page.locator('.nav-toggle')).toBeVisible();
  await page.locator('[data-nav-toggle]').click();
  await expect(page.locator('body')).toHaveClass(/menu-open/);

  const heroColumns = await page.locator('.hero-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(heroColumns).toBe(1);

  const pillarsColumns = await page.locator('.pillars-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(pillarsColumns).toBe(1);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBeFalsy();
});

test('desktop layout keeps navigation visible and multi-column grids', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');

  await expect(page.locator('.nav-toggle')).toBeHidden();
  await expect(page.locator('.nav-links')).toBeVisible();

  const heroColumns = await page.locator('.hero-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(heroColumns).toBeGreaterThan(1);

  const pillarsColumns = await page.locator('.pillars-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(pillarsColumns).toBeGreaterThan(1);
});
