// src/api.js
import axios from "axios";

export default (baseURL) => {
    const token = localStorage.getItem('token'); // Get token from localStorage each time
    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });
};