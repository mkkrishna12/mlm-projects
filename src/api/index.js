import axios from "axios";

const API = axios.create({
  baseURL: "https://vyf2k217rh.execute-api.us-east-1.amazonaws.com",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).jwt
    }`;
  }
  return req;
});

export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, post) => API.patch(`/posts/${id}`, post);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/likePost/${id}`);

export const signup = (userData) => API.post(`/registeradmin`, userData); //signup call
export const signin = (userData, role) => {
  if (role === "admin") {
    return API.post(`/login`, userData);
  } else if (role === "customer") {
    console.log("cs data ", userData);
    return API.post(`/logincustomer`, userData);
  }
};
export const registerCustomer = (userData) =>
  API.post(`/addcustomer`, userData);
export const addProduct = (productData) =>
  API.post(`/addproducts`, productData);
export const editProduct = (productData) => API.put(`/products`, productData);
export const getProduct = () => API.get(`/products`);
export const getUsername = () => API.get(`/getusername`);
export const getAdminReports = (id) => API.get(`/admin/report/${id}`);
export const fetchRegistrationPins = (username) =>
  API.get(`/fetchregistrationpins/${username}`);
export const addEPins = (body) => API.post(`/provideregistrationpins`, body);
export const orderHistory = () => API.get(`/productpurchase/all`);
export const networkTree = (username) =>
  API.get(`/customer/network/${username}`);
export const highPerformingCustomer = (username) =>
  API.get(`highPerformingCustomer/${username}`);
export const getNewJoinedMembers = () => API.get(`/getnewjoinedcustomer`);
export const getAllCustomers = () => API.get(`/allcustomers`);

export const validate = async(payload) => {
  try {
    const response = await API.post(`/check-unique-identifier`, payload);
    return response.data; // Assuming the response data is what you need
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error('Conflict error: The identifier is not unique.', error.response.data);
      return { status: 409, message: 'Conflict error: The identifier is not unique.', details: error.response.data };
    } else {
      console.error('An error occurred:', error.message);
      return { status: error.response ? error.response.status : 500, message: error.message };
    }
  }
};

export const updateOrderHistory = (payload) => API.put('/productpurchase/update',payload);
