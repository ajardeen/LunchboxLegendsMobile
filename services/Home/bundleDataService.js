import API from "../../configs/Axios";

const endpoint = "/bundles/published";

export const fetchBundles = async () => {
  console.log("calling");

  const { data } = await API.get(endpoint);
  console.log("data",data.data.bundles);
  

  return data.data.bundles;
};
