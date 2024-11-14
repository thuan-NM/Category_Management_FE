import createApiClient from "./api";

class AuthorServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/authors`) {
        if (!baseURL) {
            console.error("API URL not found! Make sure REACT_APP_API_URL is defined in .env file");
        }
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
    async getAuthorStatistics(){
        return (await this.api.get(`/statistics`)).data;
    }
}

export default new AuthorServices();