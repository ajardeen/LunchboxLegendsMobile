import { StyleSheet, Text, View, FlatList, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const favoritesData = [
  {
    id: "1",
    name: "Paneer Butter Masala",
    image: require("../../../assets/lblplaceholder.jpg"),
  },
  {
    id: "2",
    name: "Veg Biryani",
    image: require("../../../assets/lblplaceholder.jpg"),
  },
];

const Favorites = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Your Favorite Dishes</Text> */}

      <FlatList
        data={favoritesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Pressable style={styles.iconButton}>
              <Ionicons name="heart" size={22} color="red" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven’t added any favorites yet.</Text>
        }
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  iconButton: {
    padding: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },
});
