import { render, screen } from '@testing-library/react-native';
import Welcome from '../../src/app/index';
jest.mock('expo-router', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
      <Text accessibilityRole="link" accessibilityHint={href}>
        {children}
      </Text>
    ),
  };
});
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.requireActual('react-native').View,
}));
test('welcome offers anonymous PTO planning and labels the invitation preview', async () => {
  await render(<Welcome />);
  expect(
    screen.getByText('Make room for your next adventure.'),
  ).toBeOnTheScreen();
  expect(screen.getByRole('link', { name: 'Find my time off' })).toHaveProp(
    'accessibilityHint',
    '/pto',
  );
  expect(
    screen.getByRole('link', { name: 'Explore the invitation preview' }),
  ).toHaveProp('accessibilityHint', '/invite/routing-demo');
});
