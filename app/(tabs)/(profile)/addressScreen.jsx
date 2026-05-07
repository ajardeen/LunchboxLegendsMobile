import {
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Pressable } from "react-native";
import CustomPressable from "../../../components/UI/CustomPressable";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  useCustomerById,
  useAddAddress,
  useEditAddress,
  useFetchCustomerAddressById,
} from "../../../hooks/Profile/useCustomerHook";
import { useCustomer } from "../../../context/CustomerContext";

const addressScreen = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [isDefault, setIsDefault] = useState(false);
  const { customer, customerId } = useCustomer();
  const params = useLocalSearchParams(); // { mode, addressId }
  const isEdit = params.mode === "edit";
  const { data: customerEditAddress, isLoading: isCustomerEditAddressLoading } =
    useFetchCustomerAddressById(customerId, params.addressId);

  const setEditingAddress = (address) => {
    if (address) {
      setAddressLabel(address.label || "home");
      setStreet(address.street1);
      setCity(address.city);
      setRegion(address.state);
      setPinCode(address.pinCode);
      setCountry(address.country);
      setDeliveryNotes(address.deliveryNotes);
      setIsDefault(address.isDefault);
      setSelectedAddressId(address._id);
    }
  };

  useEffect(() => {
    // console.log("customerEditAddress", customerEditAddress);
    if (customerEditAddress) {
      setEditingAddress(customerEditAddress.address);
    }
  }, [isCustomerEditAddressLoading]);

  const addAddressMutation = useAddAddress();
  const editAddressMutation = useEditAddress();

  // Form states
  const [addressLabel, setAddressLabel] = useState("home");
  const [customLabel, setCustomLabel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const router = useRouter();

  // Function to prompt user and open settings
  const promptOpenSettings = () => {
    Alert.alert(
      "Location Permission Required",
      "We need access to your location to proceed. Please enable it in the app settings.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled settings prompt"),
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // 1. Check and Request Permission
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        let { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        promptOpenSettings();
        setIsLoadingLocation(false);
        return;
      }

      setErrorMsg(null);

      // 2. Get Coordinates
      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult);

      // 3. Reverse Geocode Coordinates to Address
      const { coords } = locationResult;
      let geocodeResultData = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      // Store the full geocode result
      setGeocodeResult(geocodeResultData);

      // geocodeResult is an array of potential addresses. We usually take the first one.
      if (geocodeResultData && geocodeResultData.length > 0) {
        const firstAddress = geocodeResultData[0];
        setAddress(firstAddress);

        // Auto-populate form fields
        setStreet(firstAddress.street || firstAddress.name || "");
        setCity(firstAddress.city || "");
        setRegion(firstAddress.region || "");
        setPinCode(firstAddress.postalCode || "");
        setCountry(firstAddress.country || "");

        // 4. Console Log the details as requested
        // console.log("--- Reverse Geocoding Details ---");
        // console.log("Latitude:", coords.latitude);
        // console.log("Longitude:", coords.longitude);
        // console.log("Street:", firstAddress.street);
        // console.log("City:", firstAddress.city);
        // console.log("Pin Code:", firstAddress.postalCode);
        // console.log("Country:", firstAddress.country);
        // console.log("Full Address Object:", firstAddress);
        // console.log("Full Geocode Result Array:", geocodeResultData);
        // console.log("---------------------------------");
      }
    } catch (error) {
      console.log("Location or Geocoding Error:", error);
      setErrorMsg("An error occurred while fetching or geocoding location.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // useEffect(() => {
  //   console.log("location (coords):", location);
  //   console.log("geocodeResult:", geocodeResult);
  //   console.log("error:", errorMsg);
  // }, [location, geocodeResult, errorMsg]);

  const handleLocationPermission = () => {
    // console.log("Getting location and address...");
    getCurrentLocation();
  };

  const handleSaveAddress = async () => {
    // 1. Validate custom label
    const finalLabel = addressLabel === "custom" ? customLabel : addressLabel;

    if (addressLabel === "custom" && !customLabel.trim()) {
      Alert.alert("Error", "Please enter a custom label name");
      return;
    }

    // You need the customer ID to make the API call

    if (!customerId) {
      Alert.alert("Error", "Customer ID is missing. Cannot save address.");
      return;
    }

    setIsLoadingSave(true);

    // 2. Construct the Address Body (Must match backend schema)
    const newAddressBody = {
      // The backend will determine if this is the default based on its logic
      // For now, we'll set it to false, or add a state if you want a checkbox.
      isDefault: isDefault, // You might need a checkbox/toggle for this in your UI
      label: finalLabel,
      street1: street,
      city: city,
      state: region,
      pinCode: pinCode,
      country: country,
      deliveryNotes: deliveryNotes,
      latitude: location?.coords?.latitude ?? null,
      longitude: location?.coords?.longitude ?? null,

      // NOTE: fullGeocodeResult and timestamp are optional fields.
      // I've removed fullGeocodeResult to keep the body clean unless your backend requires it.
    };

    try {
      // 3. API Call using the mutation hook
      // The useAddAddress hook is expected to take (customerId, addressBody)
      const response = await addAddressMutation.mutateAsync({
        customerId: customerId,
        body: newAddressBody,
      });

      // console.log("Add Address Success Response:", response);

      Alert.alert("Success", "Address added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(), // Go back after success
        },
      ]);
    } catch (error) {
      console.error(
        "Error adding address:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to add address. Please try again."
      );
    } finally {
      setIsLoadingSave(false);
    }
  };
  const handleUpdateAddress = async () => {
    const finalLabel = addressLabel === "custom" ? customLabel : addressLabel;

    setIsLoadingSave(true);
    const newAddressBody = {
      isDefault: isDefault,
      label: finalLabel,
      street1: street,
      city: city,
      state: region,
      pinCode: pinCode,
      country: country,
      deliveryNotes: deliveryNotes, // Added to the API body
      latitude: location?.coords?.latitude ?? null,
      longitude: location?.coords?.longitude ?? null,
    };
    const res = await editAddressMutation.mutateAsync({
      customerId,
      addressId: selectedAddressId,
      body: newAddressBody,
    });
    setIsLoadingSave(false);
    Alert.alert("Success", "Address updated successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {errorMsg && <Text style={styles.errorText}>🛑 {errorMsg}</Text>}

        {/* Form always visible */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Address</Text>

          {/* Address Label Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Label</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={addressLabel}
                onValueChange={(itemValue) => setAddressLabel(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Home" value="home" />
                <Picker.Item label="Work" value="work" />
                <Picker.Item label="Custom" value="custom" />
              </Picker>
            </View>
          </View>

          {/* Custom Label Input - shown only when "Custom" is selected */}
          {addressLabel === "custom" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Custom Label</Text>
              <TextInput
                style={styles.input}
                value={customLabel}
                onChangeText={setCustomLabel}
                placeholder="e.g., Office, Gym"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {/* Street Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="Street address"
              placeholderTextColor="#999"
            />
          </View>

          {/* City Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#999"
            />
          </View>

          {/* Region Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={region}
              onChangeText={setRegion}
              placeholder="State"
              placeholderTextColor="#999"
            />
          </View>

          {/* Pin Code Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pin Code</Text>
            <TextInput
              style={styles.input}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Pin code"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Country Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
              placeholderTextColor="#999"
            />
          </View>
          <TextInput
            style={styles.input}
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            placeholder="Delivery instructions (optional)"
          />
          <TouchableOpacity
            style={styles.defaultToggle}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={styles.defaultToggleContent}>
              <MaterialCommunityIcons
                name={isDefault ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={isDefault ? "#004346" : "#666"}
              />
              <Text style={styles.defaultToggleText}>
                Set as Default Address
              </Text>
            </View>
          </TouchableOpacity>
          <CustomPressable
            onPress={handleLocationPermission}
            disabled={isLoadingLocation}
          >
            <View
              style={[
                styles.locationButton,
                isLoadingLocation && styles.buttonDisabled,
              ]}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.locationButtonText}> Use My Location</Text>
              )}
            </View>
          </CustomPressable>

          {/* Save Button */}
          {!isEdit ? (
            <CustomPressable
              onPress={handleSaveAddress}
              disabled={isLoadingSave}
            >
              <View
                style={[
                  styles.saveButton,
                  isLoadingSave && styles.buttonDisabled,
                ]}
              >
                {isLoadingSave ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Save Address</Text>
                )}
              </View>
            </CustomPressable>
          ) : (
            <CustomPressable
              onPress={handleUpdateAddress}
              disabled={isLoadingSave}
            >
              <View
                style={[
                  styles.saveButton,
                  isLoadingSave && styles.buttonDisabled,
                ]}
              >
                {isLoadingSave ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Update Address</Text>
                )}
              </View>
            </CustomPressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default addressScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  selectionContainer: {
    padding: 16,
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fafafa",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  locationButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    minWidth: 160,
    alignItems: "center",
  },
  locationButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  formContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fafafa",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
    fontSize: 12,
  },
  picker: {
    height: 50,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: "#004346",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 15,
    alignItems: "center",
  },

  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  addressText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  // ⭐️ New styles for default toggle ⭐️
  defaultToggle: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  defaultToggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
  },
});
