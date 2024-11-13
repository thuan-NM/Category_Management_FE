// src/services/ExportServices.js

import createApiClient from "./api";

class ExportServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}`) {
        this.api = createApiClient(baseURL);
    }

    async exportCSV(collection) {
        try {
            const response = await this.api.get(`/export/csv/${collection}`, {
                responseType: 'blob', // Đảm bảo rằng response là dạng blob
            });
            return response.data;
        } catch (error) {
            throw new Error('Xuất CSV thất bại');
        }
    }
}

export default new ExportServices();