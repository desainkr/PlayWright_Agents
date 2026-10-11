// spec: test-plans/saucedemo-core-user-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('5. Order placement', () => {
  test('Complete a multi-item purchase and verify confirmation', async ({ page }) => {
    // Sign in as standard_user / secret_sauce in a fresh browser context and add two products
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 2 items');

    // Open the cart and verify products and quantities before checkout
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.nth(0)).toContainText('1');
    await expect(cartItems.nth(0)).toContainText('Sauce Labs Backpack');
    await expect(cartItems.nth(0)).toContainText('$29.99');
    await expect(cartItems.nth(1)).toContainText('1');
    await expect(cartItems.nth(1)).toContainText('Sauce Labs Bike Light');
    await expect(cartItems.nth(1)).toContainText('$9.99');

    // Proceed to checkout and enter Alex Tester with postal code 90210
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();

    // Verify both products, quantities, and totals on order overview
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);
    await expect(overviewItems.nth(0)).toContainText('1');
    await expect(overviewItems.nth(0)).toContainText('Sauce Labs Backpack');
    await expect(overviewItems.nth(0)).toContainText('$29.99');
    await expect(overviewItems.nth(1)).toContainText('1');
    await expect(overviewItems.nth(1)).toContainText('Sauce Labs Bike Light');
    await expect(overviewItems.nth(1)).toContainText('$9.99');
    await expect(page.getByText('Item total: $39.98', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $3.20', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $43.18', { exact: true })).toBeVisible();

    // Finish the order and verify the confirmation and empty cart
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');

    // Select Back Home and verify the Products catalog returns with the cart still empty
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');
  });
});
