import { test, expect } from '@playwright/test';
test('anonymous welcome to recommendation, edit and no-results', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Find my time off' }).click();
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-21');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-29');
  await page
    .getByRole('button', { name: 'Add employer holiday', exact: true })
    .click();
  await page
    .getByLabel('Holiday 1 date (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-26');
  await page
    .getByLabel('Holiday 1 name', { exact: true })
    .fill('Employer Thanksgiving');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(
    page.getByText('9 days away · 4 PTO days', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('2026: 6 PTO days remaining after this option.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'PTO dates: 2026-11-23, 2026-11-24, 2026-11-25, 2026-11-27',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page
      .getByRole('heading', { name: 'Your vacation opportunities' })
      .locator('..'),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Share option 1', exact: true }),
  ).toBeFocused();
  await page.screenshot({ path: 'reports/qa/pto-mobile.png', fullPage: true });

  // Employer holidays are explicit; removing one must change the explanation.
  await page
    .getByRole('button', { name: 'Remove holiday 1', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your vacation opportunities' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(
    page.getByText('9 days away · 5 PTO days', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Contributing holidays: None', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Available PTO balance', { exact: true }).fill('0');
  await expect(
    page.getByRole('heading', { name: 'Your vacation opportunities' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(
    page.getByText('No vacation windows fit yet', { exact: true }),
  ).toBeVisible();
});
test('invalid date can be corrected without losing other inputs', async ({
  page,
}) => {
  await page.goto('/pto');
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-02-30');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2026-03-09');
  await page.getByLabel('Annual PTO allowance', { exact: true }).fill('25');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(page.getByRole('alert')).toContainText('valid date');
  await expect(
    page.getByRole('heading', { name: 'Your vacation opportunities' }),
  ).toHaveCount(0);
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-03-01');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(
    page.getByLabel('Annual PTO allowance', { exact: true }),
  ).toHaveValue('25');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(
    page.getByText('9 days away · 6 PTO days', { exact: true }),
  ).toBeVisible();
});
test('wide screen remains navigable', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pto');
  await expect(
    page.getByRole('heading', { name: 'Make your time off go further.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Find my vacation windows' }),
  ).toBeVisible();
});

test('returning from welcome preserves the private draft in this session', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Find my time off' }).click();
  await page.getByLabel('Annual PTO allowance', { exact: true }).fill('25');
  await page.getByLabel('Available PTO balance', { exact: true }).fill('7');
  await page
    .getByRole('link', { name: 'Back to welcome', exact: true })
    .click();
  await page.getByRole('link', { name: 'Find my time off' }).click();
  await expect(
    page.getByLabel('Annual PTO allowance', { exact: true }),
  ).toHaveValue('25');
  await expect(
    page.getByLabel('Available PTO balance', { exact: true }),
  ).toHaveValue('7');
});
