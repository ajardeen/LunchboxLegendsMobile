import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const CustomBottomSheet = forwardRef(({ children, title ,initialIndex}, ref) => {
  const sheetRef = useRef(null);
  // snapPoints: ["45%" (index 0), "75%" (index 1)]
  const snapPoints = useMemo(() => ["45%", "75%"], []);

  useImperativeHandle(ref, () => ({
    // FIX 1: Change 'open' to snap to the last snap point (index 1 which is "75%")
    open: () => sheetRef.current?.snapToIndex(snapPoints.length - 1),
    close: () => sheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      // FIX 2: Change 'index' to 0 to make "45%" the default start point
     index={initialIndex || 0} // You can default to 0 (45%) or -1 (hidden)
            snapPoints={snapPoints}
            enablePanDownToClose
    >
      <BottomSheetView style={styles.contentContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default CustomBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});