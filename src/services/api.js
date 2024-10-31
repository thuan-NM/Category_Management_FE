import axios from "axios";
const token = localStorage.getItem('token'); // Lấy token từ localStorage

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    },
};

export default (baseURL) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });
};