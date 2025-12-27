// services/subscription.service.js
import API from "../../configs/Axios";

export const createSubscriptionApi = async (payload) => {
  const { data } = await API.post("/subscriptions", payload);
  return data;
};

export const getCustomerSubscriptionsApi = async (customerId) => {
  const { data } = await API.get(`/subscriptions/customer/${customerId}`);
  return data.data;
};

