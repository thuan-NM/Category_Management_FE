import createApiClient from "./api";

class EmployeeServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/employees`) {
        this.api = createApiClient(baseURL);
    }

    async getAll(params = {}) {
        return (await this.api.get(`/`, { params })).data.data;
    }

    async getById(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async create(data) {
        return (await this.api.post(`/`, data)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async login(data) {
        return (await this.api.post(`/login`, data)).data;
    }

    async count() {
        return (await this.api.get(`/count`)).data;
    }
    async exportCSV(params = {}) {
        const response = await this.api.get('/export/csv', {
            params,
            responseType: 'blob', // Đảm bảo rằng response là blob
        });
        return response.data;
    }
}

export default new EmployeeServices();