import createApiClient from "./api";

class BorrowingServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/borrowings`) {
        this.api = createApiClient(baseURL);
    }

    async getAll(query = "") {
        return (await this.api.get(`?${query}`)).data;
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

export default new BorrowingServices();