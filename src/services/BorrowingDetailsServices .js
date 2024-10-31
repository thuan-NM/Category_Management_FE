import createApiClient from "./api";

class BorrowingDetailsServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/borrowingdetails`) {
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

    async getUnreturnedBooksCount() {
        return (await this.api.get(`/unreturned-count`)).data;
    }
}

export default new BorrowingDetailsServices();