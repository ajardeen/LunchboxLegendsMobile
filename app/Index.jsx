import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export default function Index() {
  console.log("index loadded");
  
  const { userToken, loading } = useAuth();
  useEffect(()=>{
    console.log("usertoken",userToken);
    
  },[userToken])

  // 1️⃣ Wait until auth state is fully restored
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2️⃣ Auth resolved — route based on token
  if (userToken) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return <Redirect href="/(auth)/Welcome1Screen" />;
}
