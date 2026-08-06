import { Events } from "discord.js";
import { Event } from "../types/Event.js";

export default {

  name: Events.MessageCreate,

  async execute(message) {

    if (message.author.bot) return;

  },

} satisfies Event<"messageCreate">;