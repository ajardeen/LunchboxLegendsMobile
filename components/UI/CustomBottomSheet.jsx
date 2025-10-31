import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const CustomBottomSheet = forwardRef(({ children, title }, ref) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.expand(),
    close: () => sheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
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
