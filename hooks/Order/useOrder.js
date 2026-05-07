import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchOrders,
  createOrder,
  fetchCustomerOrders,
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
      // console.log("Order created");
      Alert.alert("Order Created");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      console.log(err);
      //   toast.error(err?.response?.data?.message || "Failed to create order");
    },
  });
};

export const useCustomerOrders = (id) => {
  return useQuery({
    queryKey: ["customer-orders", id],
    queryFn: () => fetchCustomerOrders(id),
    staleTime: Infinity,
  });
};
