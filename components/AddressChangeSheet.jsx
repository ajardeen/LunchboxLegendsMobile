import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "./UI/CustomPressable";

const AddressChangeSheet = ({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onClose,
  router,
  loading, // pass true while fetching
}) => {
  const handleManageAddress = () => {
    router.push("/(tabs)/index");
    onClose();
  };

  // Loader when data not available
  if (loading) {
    return (
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#004346" />
      </View>
    );
  }

  // Empty State
  if (!addresses.length) {
    return (
      <View style={styles.emptyBox}>
        <Text>No saved addresses found</Text>
        <CustomPressable
          onPress={handleManageAddress}
          style={styles.manageButton}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.manageButtonText}>Add Address</Text>
        </CustomPressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {addresses.map((address) => {
          const isSelected = selectedAddressId
            ? address._id === selectedAddressId
            : address.isDefault;

          const formattedAddress = `${address.street1 || ""} ${
            address.street2 || ""
          }, ${address.city || ""}, ${address.state || ""} - ${
            address.pinCode || ""
          }, ${address.country || ""}`;

          return (
            <Pressable
              key={address._id}
              style={styles.addressRow}
              onPress={() => onSelectAddress(address._id)}
            >
              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.addressTitle}>{address.label}</Text>
                <Text style={styles.addressDetail}>{formattedAddress}</Text>
                {address.isDefault && (
                  <Text style={styles.defaultTag}>Default Address</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <CustomPressable
        style={styles.manageButton}
        onPress={handleManageAddress}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.manageButtonText}>Manage Addresses</Text>
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, width: "100%", maxHeight: 350 },
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
  textContainer: { flex: 1 },
  addressTitle: { fontSize: 16, fontWeight: "bold", color: "#333" ,textTransform:"uppercase"},
  addressDetail: { fontSize: 14, color: "#666", marginTop: 2 },
  defaultTag: { fontSize: 12, color: "#004346", marginTop: 3 },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004346",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 15,
    marginBottom: 15,
    gap: 10,
  },
  manageButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loaderBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
});

export default AddressChangeSheet;
