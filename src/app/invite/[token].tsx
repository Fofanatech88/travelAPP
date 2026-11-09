import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { tokens } from '../../design/tokens';
export default function InvitationPreview() {
  return (
    <Screen>
      <Text
        role="heading"
        style={{ fontSize: 32, fontWeight: '700', color: tokens.colors.ink }}
      >
        A little closer to going together.
      </Text>
      <Text
        style={{ fontSize: 18, lineHeight: 28, color: tokens.colors.muted }}
      >
        Invitation routing preview. This link does not grant access to a trip.
        Secure invitations and availability responses are coming in a later
        milestone.
      </Text>
      <Link
        href="/"
        style={{ fontSize: 18, paddingVertical: 16, color: tokens.colors.ink }}
      >
        Back to welcome
      </Link>
    </Screen>
  );
}
