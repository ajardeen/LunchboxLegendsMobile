import { useState, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "../components/UI/CustomPressable";
import { bundleData } from "../services/data";
import CategoryIcon from "../components/CategoryIcon";
import { useCart } from "../context/CartContext";

export default function ItemDetail() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const { bundleId } = params;
	
	const { addToCart, cartItems } = useCart();
    
    const [isAdding, setIsAdding] = useState(false); 
    const [isFavorite, setIsFavorite] = useState(false); 

	const item = useMemo(
		() => bundleData.bundles.find((b) => b.id === bundleId),
		[bundleId]
	);

	if (!item) {
		return (
			<View style={styles.container}>
				<Text>Item not found!</Text>
			</View>
		);
	}

	const placeholderImage = require("../assets/lblplaceholder.jpg");
    
	const itemInCart = cartItems.find(cartItem => cartItem.id === item.id);

	const handleAddToCart = () => {
        if (isAdding) return; 

        setIsAdding(true);

        setTimeout(() => {
            addToCart(item); 
            setIsAdding(false);
        }, 800);
	};
    
    const handleFavirid = () => {
        const newState = !isFavorite;
        setIsFavorite(newState);
        console.log(`Bundle ID ${item.id} is now ${newState ? 'FAVORITED' : 'UNFAVORITED'}.`);
    };

    // --- Conditional Footer Button Component ---
    const FooterButton = () => {
        const button = itemInCart ? (
            // RENDER: View in Cart Button (Outline style)
            <CustomPressable
                onPress={() => router.push("/myCart")}
                style={[styles.actionButton, styles.viewInCartBtn]} // 👈 actionButton has flex: 1
            >
                <Text style={[styles.subscribeText, styles.viewInCartText]}>
                    VIEW IN CART
                </Text>
            </CustomPressable>
        ) : (
            // RENDER: Add to Cart Button (Solid style with spinner)
            <CustomPressable
                onPress={handleAddToCart}
                style={[styles.actionButton, isAdding && styles.addToCardBtnDisabled]} // 👈 actionButton has flex: 1
                disabled={isAdding}
            >
                {isAdding ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.subscribeText}>
                        Add to Cart - ₹{item.price}
                    </Text>
                )}
            </CustomPressable>
        );

        return (
            <View style={styles.footerButtonWrapper}>
                {/* Favorite Icon Button (Fixed width) */}
                <CustomPressable 
                    onPress={handleFavirid} 
                    style={styles.favoriteFooterButton}
                >
                    <Ionicons 
                        name={isFavorite ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isFavorite ? "red" : "#1E1E1E"} 
                    />
                </CustomPressable>

                {/* Main Action Button (Flex: 1 takes the rest of the space) */}
                {button}
            </View>
        );
    };
    // --- End of Conditional Footer Button Component ---


	return (
		<View style={styles.container}>
			<View style={styles.headerImageContainer}>
				<Image
					source={
						item.bundleImage ? { uri: item.bundleImage } : placeholderImage
					}
					style={styles.mainImage}
					contentFit="cover"
					transition={300}
				/>

				<View style={styles.overlay}>
                    {/* Back Button */}
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.closeButton}
					>
						<Text style={styles.closeText}>
							<Ionicons name="arrow-back" size={24} color="#000" />
						</Text>
					</TouchableOpacity>
                    
					<View style={styles.titleContent}>
						<Text style={styles.itemTitle}>{item.name}</Text>
						<Text style={styles.itemSubtitle}>{item.description}</Text>
					</View>
					<View style={styles.categoryIcon}>
						<CategoryIcon type={"veg"} size={14} />
					</View>
				</View>
			</View>

			<ScrollView style={styles.scrollArea}>
				<View style={styles.menuHeader}>
					<Text style={styles.menuHeaderText}>Daily Menu</Text>
				</View>

				{item.days.map((day, index) => (
					<CustomPressable
						key={index}
						style={styles.dayCard}
						onPress={() =>
							router.push({
								pathname: "/dayMenuList",
								params: { bundleId: item.id, day: day.day },
							})
						}
					>
						<View style={styles.dayCardLeft}>
							<View>
								<Text style={styles.dayCardDayText}>{day.day}</Text>
								<Text style={styles.dayCardMenuName}>{day.menuName}</Text>
							</View>
						</View>
						<View style={styles.dayCardRight}>
							<View style={styles.dayCardChevron}>
								<Text style={styles.dayCardNutrition}>
									{day.totalNutrition.calories} Cal
								</Text>
								<CustomPressable
									style={styles.addButton}
									onPress={() => console.log("Add on for", day.day)}
								>
									<Text style={styles.addButtonText}>Add on</Text>
								</CustomPressable>
							</View>
						</View>
					</CustomPressable>
				))}
			</ScrollView>

			{/* Footer */}
			<View style={styles.footer}>
                <FooterButton /> 
			</View>

			<Stack.Screen options={{ headerShown: false }} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffffff",
	},
	headerImageContainer: {
		height: 200,
		width: "100%",
	},
	mainImage: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		padding: 20,
		justifyContent: "space-between",
	},
	closeButton: {
		position: "absolute",
		top: 30, 
		left: 20, 
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		borderRadius: 9999,
		width: 30,
		height: 30,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 10,
	},
	closeText: {
		fontSize: 18,
		color: "#000",
		fontWeight: "bold",
	},
	titleContent: {
		position: "absolute",
		bottom: 20,
		left: 20,
	},
	itemTitle: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
	},
	itemSubtitle: {
		fontSize: 16,
		color: "#fff",
		marginBottom: 5,
	},
	scrollArea: {
		flex: 1, 
		paddingHorizontal: 15,
		paddingTop: 10,
		marginBottom: 100,
	},
	menuHeader: {
		marginBottom: 15,
	},
	menuHeaderText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#111827",
		paddingVertical: 10,
	},
	dayCard: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#F9FAFB",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	dayCardLeft: {
		flex: 1,
		justifyContent: "space-between",
		paddingRight: 10,
	},
	dayCardDayText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
		textTransform: "capitalize",
	},
	dayCardMenuName: {
		fontSize: 16,
		color: "#004346",
		textTransform: "capitalize",
		marginTop: 2,
	},
	dayCardRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	dayCardChevron: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	dayCardNutrition: {
		fontSize: 14,
		fontWeight: "600",
		color: "#374151",
		marginRight: 8,
	},
	addButton: {
		backgroundColor: "#000",
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 6,
		alignSelf: "flex-start",
		marginTop:5
	},
	addButtonText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "bold",
	},

	// --- 3. Fixed Footer Button Styles ---
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderColor: "#e5e7eb",
    width:"100%"
	},
    // Wrapper for both buttons
    footerButtonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
       
    },
    // Favorite Icon Button Style (Fixed width)
    favoriteFooterButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    // Action button style: takes up all available space
    actionButton: {
        flex: 1, 
       
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: "center",
        minHeight: 50,
        backgroundColor: "#1E1E1E",
        // justifyContent: 'center',
        width: 250,
	},
    // Existing styles applied to actionButton
	addToCardBtnDisabled: {
        opacity: 0.7,
    },
    viewInCartBtn: {
        backgroundColor: '#fff', 
        borderWidth: 2,
        borderColor: '#1E1E1E',
    },
    viewInCartText: {
        color: '#1E1E1E', 
    },
	subscribeText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	categoryIcon: {
		position: "absolute",
		bottom: 10,
		right: 10,
		backgroundColor:"#fff"
	},
});