import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React from 'react';
// 1. Import useNavigation to enable screen transitions
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- Placeholder Data ---
const userData = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+91 98765 43210',
  address: 'H-504, Gaur City 1, Noida, UP - 201009',
};

// --- Reusable Component for simple fields (Name, Email, Phone) ---
const ProfileField = ({ label, value }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// --- Component for Address (includes the navigation logic) ---
const AddressBlock = ({ address, onNavigate }) => (
  <View style={[styles.fieldContainer, styles.addressBlock]}>
    <View style={styles.addressLeft}>
      <Text style={[styles.label, { marginBottom: 5 }]}>Delivery Address</Text>
      <Text style={styles.value}>{address}</Text>
    </View>
    <Pressable 
      style={styles.changeButton} 
      onPress={onNavigate}
      android_ripple={{ color: '#ccc', borderless: false }}
    >
      <Text style={styles.changeButtonText}>CHANGE</Text>
      <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
    </Pressable>
  </View>
);

// --- Main Profile Component ---
const ProfileDetails = () => {
  // 2. Get the navigation object
  const router = useRouter()

  // Navigation handler
  const handleAddressChange = () => {
    // 3. Navigate to the AddressScreen (make sure you've defined 'AddressScreen' in your Stack Navigator)
    router.navigate('addressScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Basic Details */}
      <ProfileField label="Full Name" value={userData.name} />
      <ProfileField label="Email" value={userData.email} />
      <ProfileField label="Phone Number" value={userData.phone} />

      <View style={styles.separator} />
      
      {/* Address Block with Navigation */}
      <AddressBlock 
        address={userData.address} 
        onNavigate={handleAddressChange} 
      />
      
      <View style={styles.separator} />
      
      {/* Add more profile settings/options here if needed */}
      
    </ScrollView>
  );
};

export default ProfileDetails;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  fieldContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  separator: {
    height: 15,
  },
  addressBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 5, // Keep space for the button
  },
  addressLeft: {
    flex: 1,
    paddingRight: 10,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#007AFF', // Standard iOS blue for action items
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 2,
  },
});