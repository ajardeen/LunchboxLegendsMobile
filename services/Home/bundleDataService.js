import API from "../../configs/Axios";

const endpoint = "/bundles/published";

export const fetchBundles = async () => {
  // console.log("calling");

  const { data } = await API.get(endpoint);

  return data.data.bundles;
};
