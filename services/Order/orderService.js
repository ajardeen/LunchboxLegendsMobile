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
// export const updateOrder = async ({ id, payload }) => {
//   const { data } = await API.put(`${endpoint}/${id}`, payload);
//   return data;
// };
// export const deleteOrder = async (id) => {
//   const { data } = await API.delete(`${endpoint}/${id}`);
//   return data;
// };
