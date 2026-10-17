import { test, expect } from '@playwright/test';

test.use({ channel: 'chrome' });

test('search Amazon for laptops priced below $2,000', async ({ page }) => {
  await page.goto('https://amazon.com');

  if (/\/ap\/signin/.test(new URL(page.url()).pathname)) {
    throw new Error('Amazon requires login; the test will not attempt to sign in.');
  }

  const searchBox = page.getByRole('searchbox', { name: /search amazon/i });
  await expect(searchBox).toBeVisible();
  await searchBox.fill('laotop');
  await page.getByRole('button', { name: 'Go', exact: true }).click();

  if (/\/ap\/signin/.test(new URL(page.url()).pathname)) {
    throw new Error('Amazon requires login to view search results; the test will not attempt to sign in.');
  }

  const productCards = page.locator('[data-component-type="s-search-result"]');
  await expect(productCards.first()).toBeVisible();

  const matchingProducts: Array<{ name: string; price: string }> = [];
  const cardCount = await productCards.count();

  for (let index = 0; index < cardCount; index++) {
    const card = productCards.nth(index);
    const title = card.getByRole('heading').first();
    if ((await title.count()) === 0) continue;

    const name = (await title.innerText()).trim();
    if (!/\blaptops?\b/i.test(name)) continue;

    const priceText = await card
      .locator('.a-price:not(.a-text-price) .a-offscreen')
      .allTextContents();
    const priceMatch = priceText
      .map((text) => text.match(/\$\s*([\d,]+)(?:\.(\d{2}))?/))
      .find((match) => match !== null);
    if (!priceMatch) continue;

    const dollars = Number(priceMatch[1].replace(/,/g, ''));
    const cents = Number(priceMatch[2] ?? '00');
    if (dollars * 100 + cents < 200_000) {
      matchingProducts.push({
        name,
        price: `$${dollars.toLocaleString('en-US')}.${String(cents).padStart(2, '0')}`,
      });
    }
  }

  console.log('Laptop products under $2,000:');
  for (const product of matchingProducts) {
    console.log(`${product.name} — ${product.price}`);
  }

  expect(matchingProducts.length, 'Expected at least one laptop priced below $2,000').toBeGreaterThan(0);
  for (const product of matchingProducts) {
    expect(product.name).toMatch(/\blaptops?\b/i);
    expect(Number(product.price.replace(/[$,]/g, ''))).toBeLessThan(2_000);
  }
});
