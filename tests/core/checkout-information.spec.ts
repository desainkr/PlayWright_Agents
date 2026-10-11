// spec: test-plans/saucedemo-core-user-operations.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('4. Checkout information', () => {
  test('Validate checkout fields and review order details', async ({ page }) => {
    // Sign in as standard_user / secret_sauce, add Backpack, open the cart, and start checkout
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.getByRole('form', { name: 'Checkout information' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();

    // Submit the form blank and verify the required-field error
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    // Enter Alex Tester and postal code 90210, then continue to the order overview
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    const checkoutItem = page.locator('.cart_item');
    await expect(checkoutItem).toHaveCount(1);
    await expect(checkoutItem).toContainText('1');
    await expect(checkoutItem).toContainText('Sauce Labs Backpack');
    await expect(checkoutItem).toContainText('$29.99');

    // Verify payment, shipping, item subtotal, tax, and total
    await expect(page.getByText('Payment Information:', { exact: true })).toBeVisible();
    await expect(page.getByText('SauceCard #31337', { exact: true })).toBeVisible();
    await expect(page.getByText('Shipping Information:', { exact: true })).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!', { exact: true })).toBeVisible();
    await expect(page.getByText('Item total: $29.99', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $2.40', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $32.39', { exact: true })).toBeVisible();
  });
});
