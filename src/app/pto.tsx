import { Link } from 'expo-router';
import { Screen } from '../components/ui/Screen';
import { PtoPlanner } from '../features/pto/PtoPlanner';
export default function Pto() {
  return (
    <Screen>
      <Link href="/" style={{ paddingVertical: 12 }}>
        Back to welcome
      </Link>
      <PtoPlanner />
    </Screen>
  );
}
