import axios from "axios";

const url = "https://randomuser.me/api/?results=20";

const fetchUserData = () => {
  return axios
    .get(url)
    .then((res) => {
      const { results } = res.data;
      return results;
    })
    .catch((error) => {
      console.error(error);
    });
};

export { fetchUserData };