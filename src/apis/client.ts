import axios from 'axios';

export const ClientsApi = {
  async getRawClientsData() {
    const url = "https://api.jsonbin.io/v3/b/65ab8e911f5677401f21affe";
    const response = axios.get(url, {
      headers: {
        "X-Master-Key": "$2a$10$JOYEwsK0HhcGPLkI0zEMjO5WNZX4lEjIqaCaHG33KNHb8BiVxUaVi"
      }
    })
    console.log("response", response);
    return response;
  },
};