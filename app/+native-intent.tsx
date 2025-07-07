import { Redirect, useLocalSearchParams } from 'expo-router';

export default function NativeIntent() {
  const params = useLocalSearchParams();
  
  // Handle event detail deep links
  if (params.eventId) {
    return <Redirect href={`/event/detail?eventId=${params.eventId}`} />;
  }
  
  // Default redirect to home
  return <Redirect href="/(tabs)" />;
}