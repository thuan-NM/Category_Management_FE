import createApiClient from "./api";

class LibraryCardServices {
  constructor(baseURL = `${import.meta.env.VITE_API_URL}` + `/librarycards`) {
    this.api = createApiClient(baseURL);
  }

  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
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
  async unlock(id) {
    return (await this.api.patch(`/${id}/unlock`)).data;
  }
}

export default new LibraryCardServices();
