import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
// 1. Import BottomSheetBackdrop
import BottomSheet, {
  BottomSheetView,
    BottomSheetKeyboardAvoidingView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const CustomBottomSheet = forwardRef(
  ({ children, title, initialIndex,snapPoints =["45%", "75%"] }, ref) => {
    const sheetRef = useRef(null);
    // const snapPoints = useMemo(() => ["45%", "75%"], []);

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
      >
        <BottomSheetView style={styles.contentContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

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
