// spec: test-plans/saucedemo-core-user-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. Product discovery', () => {
  test('Sort the catalog and inspect product details', async ({ page }) => {
    // Sign in as standard_user / secret_sauce from a fresh browser context
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    const products = page.locator('.inventory_item');
    const sort = page.locator('[data-test="product-sort-container"]');
    await expect(products).toHaveCount(6);
    await expect(sort).toHaveValue('az');

    // Select Price (low to high) and verify the cheapest and most expensive products are at the ends
    await sort.selectOption('lohi');
    await expect(products.first()).toContainText('Sauce Labs Onesie');
    await expect(products.first()).toContainText('$7.99');
    await expect(products.last()).toContainText('Sauce Labs Fleece Jacket');
    await expect(products.last()).toContainText('$49.99');

    // Select Name (Z to A), then open Sauce Labs Backpack details
    await sort.selectOption('za');
    await expect(products.first()).toContainText('Test.allTheThings() T-Shirt (Red)');
    await expect(products.last()).toContainText('Sauce Labs Backpack');
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText(/carry\.allTheThings\(\)/)).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // Use Back to products to return to the catalog
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(products).toHaveCount(6);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
