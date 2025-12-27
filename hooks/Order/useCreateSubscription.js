// hooks/Subscription/useCreateSubscription.js
import { useMutation } from "@tanstack/react-query";
import { createSubscriptionApi } from "../../services/Order/subscription.service";


export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: createSubscriptionApi,
  });
};
