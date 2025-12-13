import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCustomerAddress,
  editCustomerAddress,
  deleteCustomerAddress,
  getCustomerById,
  fetchCustomerAddressById,
} from "../../services/Profile/customerService";

export const useCustomerById = (customerId) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
  });
};

export const useFetchCustomerAddressById = (customerId, addressId) => {
  return useQuery({
    queryKey: ["customerAddress", customerId, addressId],
    queryFn: () => fetchCustomerAddressById(customerId, addressId),
  });
};

export const useAddAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, body }) => addCustomerAddress(customerId, body),
    onSuccess: () => qc.invalidateQueries(["customer"]),
  });
};

export const useEditAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, addressId, body }) =>
      editCustomerAddress(customerId, addressId, body),
    onSuccess: () => qc.invalidateQueries(["customer"]),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, addressId }) =>
      deleteCustomerAddress(customerId, addressId),
    onSuccess: () => qc.invalidateQueries(["customer"]),
  });
};
