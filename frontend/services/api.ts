import axios from "axios";

const api = axios.create({
  baseURL: "https://my-ecommerce-okowta.fly.dev/api",
});

export default api;