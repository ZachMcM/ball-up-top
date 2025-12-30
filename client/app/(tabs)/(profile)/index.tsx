import { authClient } from '@/lib/auth-client';
import { Redirect } from 'expo-router';

export default function ProfileIndex() {
  const { data: currentUserData } = authClient.useSession();

  return (
    <Redirect
      href={{
        pathname: '/(tabs)/(profile)/user/[userId]',
        params: { userId: currentUserData?.user.id! },
      }}
    />
  );
}
