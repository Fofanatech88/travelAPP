import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
test('welcome navigation and unknown route recovery', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Make room for your next adventure.' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Explore the invitation preview' })
    .focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'A little closer to going together.' }),
  ).toBeVisible();
  await page.goto('/missing-page');
  await expect(page.getByText('That page isn’t here.')).toBeVisible();
});
test('new invitation URLs load and refresh without disclosing tokens', async ({
  page,
}) => {
  const messages: string[] = [];
  page.on('console', (msg) => messages.push(msg.text()));
  for (let i = 0; i < 2; i++) {
    const token = randomUUID();
    await page.goto('/invite/' + token);
    await expect(
      page.getByText('Invitation routing preview.', { exact: false }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('link', { name: 'Back to welcome' }),
    ).toBeVisible();
    expect(await page.locator('body').innerText()).not.toContain(token);
    expect(messages.join(' ')).not.toContain(token);
  }
  await page.screenshot({
    path: 'reports/qa/invitation-mobile.png',
    fullPage: true,
  });
});

test('missing assets do not receive HTML fallback', async ({ request }) => {
  const response = await request.get('/missing-asset.js', {
    headers: { Accept: 'text/html' },
  });
  expect(response.status()).toBe(404);
});
