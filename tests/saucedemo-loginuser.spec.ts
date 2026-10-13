import { test, expect } from '@playwright/test';

test('should log in using credentials shown on the login page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  const credentialsPanel = await page.locator('#login_credentials').innerText();
  const usernames = credentialsPanel
    .split('\n')
    .map((username) => username.trim())
    .filter(Boolean);
  const username = usernames.find((candidate) => candidate === 'standard_user');

  expect(username, 'The login page should list standard_user as an accepted username').toBeDefined();
  if (!username) {
    throw new Error('The login page does not list standard_user as an accepted username.');
  }

  const passwordPanel = await page.locator('.login_password').innerText();
  const password = passwordPanel.match(/Password for all users:\s*([^\s]+)/)?.[1];

  expect(password, 'The login page should display a shared password').toBeDefined();
  if (!password) {
    throw new Error('The login page does not display a shared password.');
  }

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});
