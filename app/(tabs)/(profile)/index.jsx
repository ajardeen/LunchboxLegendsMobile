import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function profile() {
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const stored = await AsyncStorage.getItem("customer");

      if (stored) {
        setProfile(JSON.parse(stored));
      }
    };
    loadProfile();
  }, []);

  // if (!profile) {
  //   return (

  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <ImageBackground
        source={require("../../../assets/profile_bg_icon_group.png")}
        contentFit="cover"
      >
        {
          /* Profile Info */
          !profile ? (
            <View
              style={[styles.header, { justifyContent: "center" }]}
            >
              <Text>Loading profile...</Text>
            </View>
          ) : (
            <View style={styles.header}>
              <Text style={styles.name}>{profile.fullName}</Text>
              <Text style={styles.email}>{profile.email}</Text>
            </View>
          )
        }
      </ImageBackground>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable
          style={styles.row}
          onPress={() => router.navigate("profileDetails")}
        >
          <Ionicons name="person-outline" size={20} color="#000" />
          <Text style={styles.rowText}>Profile</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#888"
            style={styles.arrow}
          />
        </Pressable>

        {/* ✅ Order History */}
        {/* <Pressable
          style={styles.row}
          onPress={() => router.navigate("orderHistory")}
        >
          <MaterialIcons name="receipt-long" size={20} color="#000" />
          <Text style={styles.rowText}>Order History</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#888"
            style={styles.arrow}
          />
        </Pressable> */}

        {/* ✅ Favorites */}
        {/* <Pressable
          style={styles.row}
          onPress={() => router.navigate("favorites")}
        >
          <Ionicons name="heart-outline" size={20} color="#000" />
          <Text style={styles.rowText}>Favorites</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#888"
            style={styles.arrow}
          />
        </Pressable> */}
      </View>

      {/* Others Section */}
      <View style={styles.bottomSection}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Others</Text>

          <Pressable
            style={styles.row}
            onPress={() => router.navigate("mySubscription")}
          >
            <MaterialIcons name="event-note" size={20} color="#000" />
            <Text style={styles.rowText}>My Subscription</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#888"
              style={styles.arrow}
            />
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() => router.navigate("referFriend")}
          >
            <FontAwesome5 name="user-friends" size={18} color="#000" />
            <Text style={styles.rowText}>Refer Friends</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#888"
              style={styles.arrow}
            />
          </Pressable>

          {/* Logout */}
          <Pressable
            style={styles.row}
            onPress={() =>
              Alert.alert(
                "Confirm Logout",
                "Are you sure you want to logout?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", style: "destructive", onPress: logout },
                ],
              )
            }
          >
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={[styles.rowText, { color: "red" }]}>Logout</Text>
          </Pressable>
        </View>

        {/* Help Card */}
        <Pressable
          style={styles.supportCard}
          onPress={() => router.navigate("help")}
        >
          <Ionicons name="headset-outline" size={20} color="#000" />
          <Text style={styles.supportText}>
            Feel Free to Ask, We’re Ready to Help
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "center",
    marginBottom: 20,
    height: 180,
    width: "100%",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textTransform: "capitalize",
  },
  email: {
    fontSize: 14,
    backgroundColor: "#004D4D10",
    color: "#004D4D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { color: "#777", fontSize: 13, marginBottom: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.6,
    borderColor: "#ddd",
  },
  rowText: { fontSize: 16, marginLeft: 12, flex: 1, color: "#000" },
  arrow: { marginLeft: "auto" },
  supportCard: {
    marginTop: 30,
    backgroundColor: "#D7F3F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  supportText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
});
