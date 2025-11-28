// src/hooks/Master/useOrder.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchOrders,
  createOrder,
  //   updateOrder,
  //   deleteOrder,
} from "../../services/Order/orderService";
import { Alert } from "react-native";

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: Infinity,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      //   toast.success("Order created successfully!");
      console.log("Order created");
        Alert.alert("Order Created")
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      console.log(err);
    //   toast.error(err?.response?.data?.message || "Failed to create order");
    },
  });
};
// export const useUpdateOrder = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateOrder,
//     onSuccess: () => {
//       toast.success("Order updated successfully!");
//       queryClient.invalidateQueries(["orders"]);
//     },
//     onError: (err) => {
//       console.log(err);
//       toast.error(err?.response?.data?.message || "Failed to update order");
//     },
//   });
// };
// export const useDeleteOrder = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteOrder,
//     onSuccess: () => {
//       toast.success("Order deleted successfully!");
//       queryClient.invalidateQueries(["orders"]);
//     },
//     onError: (err) => {
//       console.log(err);
//       toast.error(err?.response?.data?.message || "Failed to delete order");
//     },
//   });
// };
