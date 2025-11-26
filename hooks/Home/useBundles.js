import { useQuery } from "@tanstack/react-query";
import { fetchBundles } from "../../services/Home/bundleDataService";

export const useBundles = () => {
  return useQuery({
    queryKey: ["bundles"],
    queryFn: fetchBundles,
    // refetchOnWindowFocus: false,
    // cacheTime:Infinity,
    // staleTime:Infinity,
    onError: (error) => {
      console.log(error);
    },
  });
};
