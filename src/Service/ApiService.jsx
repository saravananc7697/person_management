import axios from "axios";

const defaultHeaders = {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_API_KEY,
};
// console.log(process.env.REACT_APP_BASE_URL);

const ApiService = {
  async request(method, url, data = null) {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: defaultHeaders,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiService;
