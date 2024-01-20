import { Client } from './types/Client';
import { defineStore } from "pinia";
import { ClientsApi } from "@/apis/client";

interface ClientsStore {
  clients: Array<Client>
  maxId: number
}

export const useClientsStore = defineStore("client", {
  state: (): ClientsStore => {
    return {
      clients: [],
      maxId: 0,
    };
  },
  getters: {
  },
  actions: {
    async getClientsData(query?: string) {
      this.clients = (await ClientsApi.getRawClientsData()).data.record;
      this.maxId = this.clients.length - 1;
      console.log("this.clients", this.clients);
    },
    addClient(client: Client) {
      this.clients = [...this.clients, {
        id: this.maxId + 1,
        created_at: new Date().toISOString(),
        fullname: client.fullname,
        phone: client.phone,
        region: client.region,
        status: client.status
      }]
    },
    removeClient(clientId: number) {
      this.clients = this.clients.filter((client) => client.id !== clientId);
    }
  },
});