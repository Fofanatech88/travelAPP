import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { branding } from '../constants/branding';
import { tokens } from '../design/tokens';
export default function Welcome() {
  return (
    <Screen>
      <Text style={styles.brand}>{branding.name}</Text>
      <View
        accessible
        accessibilityLabel="Adventure compass illustration"
        style={styles.compass}
      >
        <Text style={styles.symbol}>↗</Text>
      </View>
      <Text role="heading" style={styles.title}>
        {branding.tagline}
      </Text>
      <Text style={styles.body}>
        Less back-and-forth. More time together. Find a vacation window that
        works for you and the people you love.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Good plans start with a little space.
        </Text>
        <Text style={styles.body}>
          Find a useful vacation window with your available PTO and employer
          holidays. Start with your own dates, then plan together.
        </Text>
      </View>
      <Link href="/pto" style={styles.link}>
        Find my time off
      </Link>
      <Link
        href="/invite/routing-demo"
        style={{ color: tokens.colors.ink, paddingVertical: 12 }}
      >
        Explore the invitation preview
      </Link>
      <Text style={styles.note}>
        Development preview · No account or permissions needed
      </Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  brand: { fontSize: 16, fontWeight: '700', color: tokens.colors.ink },
  compass: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E1EBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: { fontSize: 60, color: tokens.colors.ink },
  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
    color: tokens.colors.ink,
  },
  body: { fontSize: 18, lineHeight: 28, color: tokens.colors.muted },
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 24,
    padding: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  cardTitle: { fontSize: 20, fontWeight: '600', color: tokens.colors.ink },
  link: {
    backgroundColor: tokens.colors.ink,
    color: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    fontSize: 17,
    textAlign: 'center',
    minHeight: 56,
  },
  note: { fontSize: 14, lineHeight: 22, color: tokens.colors.muted },
});
