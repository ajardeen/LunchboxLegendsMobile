import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CustomBottomSheet = forwardRef(
  ({ children, title, initialIndex, snapPoints = ["45%", "75%"] }, ref) => {
    const sheetRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(snapPoints.length - 1),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = React.useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={sheetRef}
        index={initialIndex !== undefined ? initialIndex : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.headerContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
          </View>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
});