import { Client } from "discord.js";

import clientReady from "../events/clientReady.js";
import interactionCreate from "../events/interactionCreate.js";
import messageCreate from "../events/messageCreate.js";

import { Event } from "../types/Event.js";

const events: Event[] = [
  clientReady,
  interactionCreate,
  messageCreate,
];

export function registerEvents(client: Client) {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}