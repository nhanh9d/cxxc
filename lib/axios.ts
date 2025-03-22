// lib/axios.ts
import axios from 'axios';
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl, // Replace this
});

export default api;
