import { Client } from "./types/Client";
import { defineStore } from "pinia";
import { ClientsApi } from "@/apis/client";

interface ClientsStore {
  clients: Array<Client>;
  maxId: number;
}

export const useClientsStore = defineStore("client", {
  state: (): ClientsStore => {
    return {
      clients: [],
      maxId: 0,
    };
  },
  getters: {
    lastItem: (state) => state.clients.find((client: Client) => client.id === state.maxId)
  },
  actions: {
    async getClientsData(query?: string) {
      this.clients = (await ClientsApi.getRawClientsData()).data.record;
      this.maxId = this.clients.length - 1;
      console.log("this.clients", this.clients);
    },
    addClient(client: Client) {
      this.clients = [
        ...this.clients,
        {
          id: this.maxId + 1,
          created_at: new Date().toISOString(),
          fullname: client.fullname,
          phone: client.phone,
          region: client.region,
          status: client.status,
        },
      ];
      this.maxId = this.maxId + 1;
    },
    removeClient(clientId: number) {
      this.clients = this.clients.filter((client: Client) => client.id !== clientId);
    },
    updateClient(client: Client) {
      const targetClient = this.clients.find((targetClient: Client) => targetClient.id === client.id);
      if (targetClient) {
        Object.keys(client).forEach((key) => {
          targetClient[key] = client[key];
        });
      }
    }
  },
});
