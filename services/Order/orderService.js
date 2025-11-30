// src/services/Master/orderService.js
import API from "../../configs/Axios";
const endpoint = "/orders";


export const fetchOrders = async () => {
  const { data } = await API.get(endpoint);
  return data.data;
};
export const createOrder = async (payload) => {
  const { data } = await API.post(endpoint, payload);
  return data;
};

export const fetchCustomerOrders = async (customerId) => {
  const { data } = await API.get(`${endpoint}/customer/${customerId}`);
  return data;
};