// hooks/Subscription/useCustomerSubscriptions.js
import { useQuery } from "@tanstack/react-query";
import { getCustomerSubscriptionsApi, getSubscriptionDetail } from "../../services/Order/subscription.service";


export const useCustomerSubscriptions = (customerId) => {
  return useQuery({
    queryKey: ["customer-subscriptions", customerId],
    queryFn: () => getCustomerSubscriptionsApi(customerId),
    enabled: !!customerId,
  });
};

export const useSubscriptionById = (subscriptionId, customerId) => {
 
  
  return useQuery({
    // Unique key for caching: specific to this subscription for this customer
    queryKey: ['subscription', subscriptionId, customerId],
    
    queryFn: () => getSubscriptionDetail(subscriptionId, customerId),
    
    // The query only executes if both IDs are truthy
    enabled: !!subscriptionId && !!customerId,
    
    refetchOnMount:true,
    refetchOnWindowFocus:true,
    
  });
};