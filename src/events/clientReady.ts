import { Events } from "discord.js";
import { Event } from "../types/Event.js";

export default {
  name: Events.ClientReady,
  once: true,

  execute(client) {
    console.log(`✅ ${client.user.tag} conectado`);
  },
} satisfies Event<"clientReady">;