/* --- Create this file, e.g., components/AddressChangeSheet.js --- */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "./UI/CustomPressable"; // Assuming this path

const AddressChangeSheet = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onClose,
  router,
}) => {
  const handleManageAddress = () => {
    router.push("/addressScreen");
    onClose();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {addresses.map((address) => {
          const isSelected = address.id === selectedAddressId;
          return (
            <Pressable
              key={address.id}
              style={styles.addressRow}
              onPress={() => onSelectAddress(address.id)}
            >
              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.addressTitle}>{address.title}</Text>
                <Text style={styles.addressDetail}>{address.address}</Text>
                <Text style={styles.addressDetail}>{address.phone}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <CustomPressable style={styles.manageButton} onPress={handleManageAddress}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.manageButtonText}>Manage Addresses</Text>
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    width:"100%"
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#004346",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#004346",
  },
  textContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addressDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004346",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 15,
    gap: 10,
  },
  manageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddressChangeSheet;