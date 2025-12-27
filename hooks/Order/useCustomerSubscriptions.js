// hooks/Subscription/useCustomerSubscriptions.js
import { useQuery } from "@tanstack/react-query";
import { getCustomerSubscriptionsApi } from "../../services/Order/subscription.service";


export const useCustomerSubscriptions = (customerId) => {
  return useQuery({
    queryKey: ["customer-subscriptions", customerId],
    queryFn: () => getCustomerSubscriptionsApi(customerId),
    enabled: !!customerId,
  });
};
