import { useLocation } from '@/components/providers/LocationProvider';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AlertTriangle, MapPin } from 'lucide-react-native';
import { ActivityIndicator, Linking, View } from 'react-native';

export default function LocationPermissionPage() {
  const { locationPermissionStatus, requestPermission, isRequestingPermission } = useLocation();

  return (
    <View className="flex w-full flex-1 flex-col items-center justify-center gap-4 p-8">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Icon as={MapPin} size={40} className="text-foreground" />
      </View>
      <View className="items-center gap-2">
        <Text className="text-center text-2xl font-bold">Location Access Needed</Text>
        <Text className="max-w-xs text-center text-sm font-medium text-muted-foreground">
          We need your location to show you nearby basketball courts and help you find games.
        </Text>
      </View>
      {locationPermissionStatus === 'denied' ? (
        <>
          <Alert variant="destructive" icon={AlertTriangle}>
            <AlertTitle>
              Loaction access was denied. Please enable it in Settings to continue.
            </AlertTitle>
          </Alert>
          <Button className="w-full" onPress={() => Linking.openSettings()}>
            <Text>Open Settings</Text>
          </Button>
        </>
      ) : (
        <Button className="w-full" onPress={requestPermission} disabled={isRequestingPermission}>
          <Text>Enable Location Access</Text>
          {isRequestingPermission && <ActivityIndicator className='text-primary-foreground' />}
        </Button>
      )}
      <Text className="max-w-sm text-center text-xs text-muted-foreground">
        Your location is only used while you're using the app. We never share your location with
        third parties.
      </Text>
    </View>
  );
}
