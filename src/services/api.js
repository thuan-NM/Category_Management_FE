// src/api.js
import axios from "axios";
import store from "../store"; // Đảm bảo đường dẫn đúng đến Redux store
import { logout } from "../store/authSlice"; // Đảm bảo đường dẫn đúng đến authSlice
import { toast } from "react-toastify";

/**
 * Hàm tạo một instance của Axios với cấu hình cơ bản và các interceptors.
 * @param {string} baseURL - URL cơ bản của API.
 * @returns {AxiosInstance} - Instance của Axios đã được cấu hình.
 */
const createApiClient = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    // Thêm interceptor để thêm Authorization header trước mỗi yêu cầu
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            } else {
                delete config.headers["Authorization"];
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Thêm interceptor để xử lý các phản hồi lỗi chung
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Dispatch hành động logout để cập nhật trạng thái Redux
                store.dispatch(logout());

                // Hiển thị thông báo lỗi cho người dùng
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
                    position: "top-right",
                });

                // Chuyển hướng người dùng đến trang đăng nhập
                window.location.href = "/auth";
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default createApiClient;