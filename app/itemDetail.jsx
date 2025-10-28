import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetail() {
  // Use useLocalSearchParams to retrieve the data passed from the home screen
  const params = useLocalSearchParams();
  
  // Extract parameters and provide default/fallback values
  const { 
    title, 
    imageUri, 
    tag = 'N/A',
    tagColor = '#000000', // Default black if color is missing
    price = '1399', // Default price, will be used in the footer
  } = params;

  // Static Data to populate the daily menu, as seen in the image
  const menuItems = [
    { day: 'Monday', meal: 'Dal Fry + Rice + Chapati', weight: '460g', cal: '650 Cal', delivery: '12:00 PM', isVeg: true },
    { day: 'Tuesday', meal: 'Dal Fry + Rice + Chapati', weight: '460g', cal: '650 Cal', delivery: '12:00 PM', isVeg: true },
    { day: 'Wednesday', meal: 'Chicken Curry + Rice', weight: '500g', cal: '720 Cal', delivery: '12:00 PM', isVeg: false },
    // Add more days...
  ];

  // State for toggling between Non Veg / Veg menu view (implied by image)
  const [isNonVeg, setIsNonVeg] = useState(false);

  // Filter items based on the toggle (assuming a simple filter for this example)
  const filteredMenuItems = menuItems.filter(item => isNonVeg ? !item.isVeg : item.isVeg);

  return (
    <View style={styles.container}>
      {/* 1. Header and Image Container (Fixed Height) */}
      <View style={styles.headerImageContainer}>
        <Image 
          source={{ uri: imageUri || 'https://placehold.co/600x400/000000/ffffff?text=Image+Missing' }} 
          style={styles.mainImage}
          contentFit="cover"
        />
        
        {/* Overlay Content & Close Button */}
        <View style={styles.overlay}>
          {/* Close Button (Absolute Position) */}
          <TouchableOpacity
           
            onPress={() => router.back()} 
            style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Title Text */}
          <View style={styles.titleContent}>
            <Text style={styles.itemTitle}>{title || 'Monthly Pack'}</Text>
            <Text style={styles.itemSubtitle}>We know your taste</Text>
            
            {/* Veg/Non-Veg Toggle (simplified for UI) */}
            <View style={styles.tagToggleRow}>
              <Text style={styles.tagTextSmall}>
                {tag}
              </Text>
              <Text style={styles.tagTextSmallDivider}> | </Text>
              <Text style={styles.tagTextSmall}>
                {isNonVeg ? 'Non Veg' : 'Veg'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Scrollable Content Area */}
      <ScrollView style={styles.scrollArea}>
        <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>{isNonVeg ? 'Non Veg Meals' : 'Veg Meals'}</Text>
        </View>

        {/* Menu Items List */}
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItemCard}>
            {/* Left Content */}
            <View>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.mealText}>{item.meal}</Text>
              
              <View style={styles.deliveryRow}>
                  <Ionicons name="time-outline" size={14} color="#004346" />
                  <Text style={styles.deliveryTime}>Delivery at: {item.delivery}</Text>
                  {/* Veg/Non-Veg Icon (Red Box) */}
                  <View style={item.isVeg ? styles.vegSquare : styles.nonVegSquare} />
              </View>
            </View>

            {/* Right Content */}
            <View style={styles.rightContent}>
              <Text style={styles.weightText}>{item.weight}</Text>
              <Text style={styles.calText}>{item.cal}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add on</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>
            Subscribe ₹{price}+60
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Ensure header is not shown by Stack, since we made a custom one */}
      <Stack.Screen options={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // --- 1. Header/Image/Overlay Styles ---
  headerImageContainer: {
    height: 250, // Fixed height for the banner
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay on image
    padding: 20,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 30, // Pushed down from the absolute top
    right: 20, // Pushed left from the absolute right
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 9999,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  titleContent: {
    // Content is at the bottom of the overlay container (due to space-between)
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  itemTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  tagToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  tagTextSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E5E5',
  },
  tagTextSmallDivider: {
    fontSize: 14,
    color: '#E5E5E5',
    marginHorizontal: 5,
  },

  // --- 2. Scrollable Content Styles ---
  scrollArea: {
    flex: 1,
    backgroundColor: '#000', // Black background for the scroll area
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  menuHeader: {
    marginBottom: 15,
  },
  menuHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 10,
    fontStyle: 'italic', // Approximation for the script font look
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E', // Dark card background
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mealText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#004346',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 10,
  },
  vegSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#00A86B',
    backgroundColor: '#00A86B',
  },
  nonVegSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#FF4500',
    backgroundColor: '#FF4500',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  weightText: {
    fontSize: 14,
    color: '#ccc',
  },
  calText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // --- 3. Fixed Footer Button Styles ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
    // Top shadow for the footer to lift it off the content
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 10, // Android shadow
      },
    }),
  },
  subscribeButton: {
    backgroundColor: '#1E1E1E', // Dark button color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});