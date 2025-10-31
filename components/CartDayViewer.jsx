// CartDayViewer.js (New Component)
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

// Renders the detailed view of a cart item (only bundles and add-on bundles)
const CartDayViewer = ({ item }) => {

    if (!item) {
        return <Text style={styles.errorText}>No item selected for view.</Text>;
    }

    const isBundle = item.days && Array.isArray(item.days);
    const isAddOnBundle = item.isAddOnBundle;

    // --- RENDER LOGIC FOR MAIN MEAL BUNDLE ---
    if (isBundle) {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.headerText}>Days in Bundle</Text>
                {item.days.map((dayData, index) => {
                    // Calculate total items (core items + add-ons, if they were bundled together)
                    const totalCoreItems = dayData.items ? dayData.items.length : 0;
                    const totalItems = totalCoreItems; // We only show core items here

                    return (
                        <View key={index} style={styles.dayCard}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayTitle}>{dayData.day}</Text>
                                <Text style={styles.daySubtitle}>{dayData.menuName}</Text>
                            </View>
                            <View style={styles.detailsList}>
                                {dayData.items.map((mealItem, mealIndex) => (
                                    <View key={mealIndex} style={styles.detailRow}>
                                        <Ionicons name="fast-food-outline" size={14} color="#666" style={{ marginRight: 5 }} />
                                        <Text style={styles.detailText}>
                                            {mealItem.itemName} ({mealItem.quantity} {mealItem.uom})
                                        </Text>
                                    </View>
                                ))}
                                {/* If there was a separate add-on bundle for this day, you'd fetch and display it here */}
                                <Text style={styles.footerNote}>
                                    Total Calories: {dayData.totalNutrition.calories} Cal
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        );
    } 
    
    // --- RENDER LOGIC FOR ADD-ON BUNDLE ---
    if (isAddOnBundle) {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.headerText}>Add-ons for {item.day}</Text>
                <Text style={styles.subtotalText}>Total Add-on Cost: ₹{item.price.toFixed(2)}</Text>
                
                {item.products.map((product, index) => (
                    <View key={index} style={styles.productCard}>
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productDescription}>{product.description}</Text>
                        </View>
                        <Text style={styles.productQuantity}>
                            × {product.quantity}
                        </Text>
                        <Text style={styles.productPrice}>
                            ₹{(product.price * product.quantity).toFixed(2)}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        );
    }

    // Default view for simple items (e.g., individual add-ons if you switched back)
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{item.name}</Text>
            <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
            <Text style={styles.detailText}>Price: ₹{item.price.toFixed(2)} per unit</Text>
        </View>
    );
};

export default CartDayViewer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1F2937',
    },
    subtotalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#004346',
        marginBottom: 15,
    },
    dayCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dayHeader: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 8,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    daySubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailsList: {
        marginTop: 5,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailText: {
        fontSize: 14,
        color: '#374151',
    },
    footerNote: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#004346',
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    productDescription: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    productQuantity: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15,
        color: '#1F2937',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    }
});