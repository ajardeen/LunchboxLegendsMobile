import API from "../../configs/Axios";

export const getCustomerById = async (customerId) => {
  const res = await API.get(`/customers/${customerId}`);
  return res.data;
};

export const addCustomerAddress = async (customerId, body) => {
  const res = await API.post(`/customers/address/${customerId}`, body);
  return res.data;
};
export const fetchCustomerAddressById = async (customerId, addressId) => {
  const res = await API.get(`/customers/address/${customerId}/${addressId}`);
  return res.data;
};

export const editCustomerAddress = async (customerId, addressId, body) => {
  const res = await API.put(
    `/customers/address/${customerId}/${addressId}`,
    body
  );
  return res.data;
};

export const deleteCustomerAddress = async (customerId, addressId) => {
  const res = await API.delete(`/customers/address/${customerId}/${addressId}`);
  return res.data;
};
