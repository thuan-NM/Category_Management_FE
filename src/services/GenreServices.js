import createApiClient from "./api";

class GenreServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/genres`) {
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
}

export default new GenreServices();