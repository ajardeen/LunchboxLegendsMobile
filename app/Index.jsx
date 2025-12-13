import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext"; 
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { userToken, loading } = useAuth();

  // 1) While auth is loading → show nothing or a loader (native splash stays visible)
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
    // or just: return null;
  }

  // 2) After loading:
  if (userToken) {
    // already logged in
    return <Redirect href="/(tabs)/(home)" />;
  }

  // 3) No token → go to welcome
  return <Redirect href="/(auth)/Welcome1Screen" />;
}
