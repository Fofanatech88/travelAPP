import { AccessibilityInfo, Share } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PtoPlanner } from '../../src/features/pto/PtoPlanner';

test('anonymous planner explains real PTO costs and clears stale results on edit', async () => {
  await render(<PtoPlanner />);
  await fireEvent.changeText(
    screen.getByLabelText('Search from (YYYY-MM-DD)'),
    '2026-11-21',
  );
  await fireEvent.changeText(
    screen.getByLabelText('Search through (YYYY-MM-DD)'),
    '2026-11-29',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Add employer holiday' }),
  );
  await fireEvent.changeText(
    screen.getByLabelText('Holiday 1 date (YYYY-MM-DD)'),
    '2026-11-26',
  );
  await fireEvent.changeText(
    screen.getByLabelText('Holiday 1 name'),
    'Employer Thanksgiving',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Find my vacation windows' }),
  );
  expect(screen.getByText('9 days away · 4 PTO days')).toBeOnTheScreen();
  expect(
    screen.getByText('2026: 6 PTO days remaining after this option.'),
  ).toBeOnTheScreen();
  await fireEvent.changeText(
    screen.getByLabelText('Available PTO balance'),
    '0',
  );
  expect(screen.queryByText('Your vacation opportunities')).toBeNull();
  await fireEvent.press(
    screen.getByRole('button', { name: 'Find my vacation windows' }),
  );
  expect(screen.getByText('No vacation windows fit yet')).toBeOnTheScreen();
});

test('invalid input is actionable rather than showing an impossible option', async () => {
  await render(<PtoPlanner />);
  await fireEvent.changeText(
    screen.getByLabelText('Search from (YYYY-MM-DD)'),
    '2026-02-30',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Find my vacation windows' }),
  );
  expect(screen.getByRole('alert')).toHaveTextContent(/valid date/);
  expect(screen.queryByText('Your vacation opportunities')).toBeNull();
});

test('iOS announces the recommendation outcome', async () => {
  const announce = jest
    .spyOn(AccessibilityInfo, 'announceForAccessibility')
    .mockImplementation(() => {});
  await render(<PtoPlanner />);
  await fireEvent.changeText(
    screen.getByLabelText('Search from (YYYY-MM-DD)'),
    '2026-11-21',
  );
  await fireEvent.changeText(
    screen.getByLabelText('Search through (YYYY-MM-DD)'),
    '2026-11-29',
  );
  await fireEvent.press(
    screen.getByRole('button', { name: 'Find my vacation windows' }),
  );
  expect(announce).toHaveBeenCalledWith(
    expect.stringContaining('Found 1 vacation opportunities'),
  );
  announce.mockRestore();
});

test('native sharing excludes private inputs and reports dismissal', async () => {
  const share = jest
    .spyOn(Share, 'share')
    .mockResolvedValue({ action: Share.dismissedAction });
  try {
    await render(<PtoPlanner />);
    await fireEvent.changeText(
      screen.getByLabelText('Search from (YYYY-MM-DD)'),
      '2026-11-21',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Search through (YYYY-MM-DD)'),
      '2026-11-29',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Annual PTO allowance'),
      '143',
    );
    await fireEvent.changeText(
      screen.getByLabelText('Available PTO balance'),
      '77',
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Find my vacation windows' }),
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Share option 1' }),
    );
    expect(share).toHaveBeenCalledWith({
      message:
        'Vacation idea: 2026-11-21 to 2026-11-29. 9 days away using 5 PTO days, assuming Monday–Friday work and confirmed employer holidays. Leave still requires employer approval.',
    });
    expect(screen.getByText('Sharing cancelled.')).toBeOnTheScreen();
  } finally {
    share.mockRestore();
  }
});
