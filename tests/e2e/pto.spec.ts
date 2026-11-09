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

test('cross-year searches require explicit budgets and keep them tied to years', async ({
  page,
}) => {
  await page.goto('/pto');
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-12-31');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2027-01-03');
  await page.getByLabel('Vacation length in days', { exact: true }).fill('4');
  await expect(
    page.getByLabel('Next year annual allowance', { exact: true }),
  ).toHaveValue('');
  await expect(
    page.getByLabel('Next year available balance', { exact: true }),
  ).toHaveValue('');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Your vacation opportunities' }),
  ).toHaveCount(0);
  await page.getByLabel('Available PTO balance', { exact: true }).fill('1');
  await page
    .getByLabel('Next year annual allowance', { exact: true })
    .fill('15');
  await page
    .getByLabel('Next year available balance', { exact: true })
    .fill('1');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await expect(
    page.getByText('4 days away · 2 PTO days', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('2026: 0 PTO days remaining after this option.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText('2027: 0 PTO days remaining after this option.', {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2027-01-01');
  await expect(
    page.getByLabel('Annual PTO allowance', { exact: true }),
  ).toHaveValue('15');
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2028-01-01');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2028-01-09');
  await expect(
    page.getByLabel('Annual PTO allowance', { exact: true }),
  ).toHaveValue('');
  await expect(
    page.getByLabel('Available PTO balance', { exact: true }),
  ).toHaveValue('');
});

for (const clipboardDenied of [false, true]) {
  test(`browser share fallback with clipboard ${clipboardDenied ? 'denied' : 'available'}`, async ({
    page,
  }) => {
    await page.addInitScript((denied) => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (summary: string) => {
            if (denied) throw new Error('Clipboard denied');
            (window as unknown as { copiedSummary: string }).copiedSummary =
              summary;
          },
        },
      });
    }, clipboardDenied);
    await page.goto('/pto');
    await page
      .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
      .fill('2026-11-21');
    await page
      .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
      .fill('2026-11-29');
    await page.getByLabel('Annual PTO allowance', { exact: true }).fill('143');
    await page.getByLabel('Available PTO balance', { exact: true }).fill('77');
    await page
      .getByRole('button', { name: 'Find my vacation windows' })
      .click();
    await page
      .getByRole('button', { name: 'Share option 1', exact: true })
      .click();
    const expected =
      'Vacation idea: 2026-11-21 to 2026-11-29. 9 days away using 5 PTO days, assuming Monday–Friday work and confirmed employer holidays. Leave still requires employer approval.';
    if (clipboardDenied) {
      await expect(
        page.getByText('Select and copy this vacation summary:', {
          exact: true,
        }),
      ).toBeVisible();
      const summary = page.getByText(expected, { exact: true });
      await expect(summary).toBeVisible();
      await expect(summary).toHaveCSS('user-select', 'text');
    } else {
      await expect(
        page.getByText('Vacation summary copied.', { exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => (window as unknown as { copiedSummary: string }).copiedSummary,
        ),
      ).toBe(expected);
    }
    await page.getByLabel('Available PTO balance', { exact: true }).fill('0');
    await expect(page.getByText(expected, { exact: true })).toHaveCount(0);
    await expect(
      page.getByText('Vacation summary copied.', { exact: true }),
    ).toHaveCount(0);
  });
}

test('pending sharing cannot restore a stale summary after editing', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((_resolve, reject) => {
            (window as unknown as { rejectCopy: () => void }).rejectCopy = () =>
              reject(new Error('Denied'));
          }),
      },
    });
  });
  await page.goto('/pto');
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-21');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-29');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  await page
    .getByRole('button', { name: 'Share option 1', exact: true })
    .click();
  await page.getByLabel('Available PTO balance', { exact: true }).fill('0');
  await page.evaluate(() =>
    (window as unknown as { rejectCopy: () => void }).rejectCopy(),
  );
  await expect(
    page.getByText('Select and copy this vacation summary:', { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(/^Vacation idea:/)).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Your vacation opportunities' }),
  ).toHaveCount(0);
});

test('older share attempts cannot replace a newer completed attempt', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const pending: { resolve: () => void; reject: () => void }[] = [];
    (window as unknown as { pendingCopies: typeof pending }).pendingCopies =
      pending;
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve, reject) =>
            pending.push({
              resolve,
              reject: () => reject(new Error('Denied')),
            }),
          ),
      },
    });
  });
  await page.goto('/pto');
  await page
    .getByLabel('Search from (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-21');
  await page
    .getByLabel('Search through (YYYY-MM-DD)', { exact: true })
    .fill('2026-11-29');
  await page.getByRole('button', { name: 'Find my vacation windows' }).click();
  const share = page.getByRole('button', {
    name: 'Share option 1',
    exact: true,
  });
  await share.click();
  await share.click();
  await page.evaluate(() =>
    (
      window as unknown as { pendingCopies: { resolve: () => void }[] }
    ).pendingCopies[1]!.resolve(),
  );
  await expect(
    page.getByText('Vacation summary copied.', { exact: true }),
  ).toBeVisible();
  await page.evaluate(() =>
    (
      window as unknown as { pendingCopies: { reject: () => void }[] }
    ).pendingCopies[0]!.reject(),
  );
  await expect(
    page.getByText('Select and copy this vacation summary:', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText('Vacation summary copied.', { exact: true }),
  ).toBeVisible();
});
