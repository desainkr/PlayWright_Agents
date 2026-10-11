// spec: test-plans/saucedemo-core-user-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('3. Cart management', () => {
  test('Add and remove products from the cart', async ({ page }) => {
    // Sign in as standard_user / secret_sauce from a fresh browser context
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');

    // Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 2 items');

    // Open the cart and verify the product rows, prices, quantities, and removal actions
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.nth(0)).toContainText('1');
    await expect(cartItems.nth(0)).toContainText('Sauce Labs Backpack');
    await expect(cartItems.nth(0)).toContainText('$29.99');
    await expect(cartItems.nth(0).locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(cartItems.nth(1)).toContainText('1');
    await expect(cartItems.nth(1)).toContainText('Sauce Labs Bike Light');
    await expect(cartItems.nth(1)).toContainText('$9.99');
    await expect(cartItems.nth(1).locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // Remove Bike Light and verify its row and one item are removed
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems).not.toContainText('Sauce Labs Bike Light');
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');

    // Remove the remaining Backpack and verify the cart is empty
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(cartItems).toHaveCount(0);
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');

    // Choose Continue Shopping and confirm the catalog returns with an empty cart
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');
  });
});
