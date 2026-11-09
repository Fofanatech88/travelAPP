import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '../components/ui/Screen';
export default function NotFound() {
  return (
    <Screen>
      <Text role="heading">That page isn’t here.</Text>
      <Link href="/">Back to welcome</Link>
    </Screen>
  );
}
