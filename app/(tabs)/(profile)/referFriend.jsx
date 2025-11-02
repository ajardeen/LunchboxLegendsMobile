import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

const ReferFriend = () => {
  const [referCode] = useState("LUNCH123");

  const message = `🍱 Try *Lunchbox Legends*!  
Delicious meals delivered fresh and fast.  
Use my referral code *${referCode}* and get exciting rewards on your first order!  
Download the app now and join the lunch revolution 🚀`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referCode);
    Alert.alert("Copied", "Referral code copied to clipboard!");
  };

  const handleWhatsAppShare = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("WhatsApp not installed", "Please install WhatsApp to share.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSystemShare = async () => {
    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Refer a Friend 🎉</Text>
      <Text style={styles.subText}>
        Invite your friends to join <Text style={styles.brand}>Lunchbox Legends</Text> 
        — they’ll love our tasty meals, and you’ll earn rewards when they order using your code!
      </Text>

      {/* Referral Code Box */}
      <View style={styles.referBox}>
        <Text style={styles.referCode}>{referCode}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
          <Ionicons name="copy-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Share Section */}
      <Text style={styles.shareText}>Share your referral code via</Text>

      <View style={styles.shareRow}>
        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: "#25D366" }]}
          onPress={handleWhatsAppShare}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={styles.shareLabel}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareButton, { backgroundColor: "#007AFF" }]}
          onPress={handleSystemShare}
        >
          <Ionicons name="share-outline" size={22} color="#fff" />
          <Text style={styles.shareLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
  },
  brand: {
    fontWeight: "700",
    color: "#FF6B00",
  },
  referBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
  },
  referCode: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  copyBtn: {
    backgroundColor: "#FF6B00",
    padding: 8,
    borderRadius: 8,
  },
  shareText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "47%",
  },
  shareLabel: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});
