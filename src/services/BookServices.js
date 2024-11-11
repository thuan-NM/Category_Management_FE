// src/services/BookServices.js

import createApiClient from "./api";

class BookServices {
    constructor(baseURL = `${import.meta.env.VITE_API_URL}/books`) {
        this.api = createApiClient(baseURL);
    }

    // Get all books with query parameters
    async getAll(params = {}) {
        const response = await this.api.get('/', { params });
        return response.data.data; // Directly return { count, rows }
    }

    // Get book by ID
    async getById(id) {
        const response = await this.api.get(`/${id}`);
        return response.data.data;
    }

    // Create a new book
    async create(data) {
        const response = await this.api.post('/', data);
        return response.data.data;
    }

    // Update a book
    async update(id, data) {
        const response = await this.api.put(`/${id}`, data);
        return response.data.data;
    }

    // Delete a book
    async delete(id) {
        const response = await this.api.delete(`/${id}`);
        return response.data.data;
    }
}

export default new BookServices();
