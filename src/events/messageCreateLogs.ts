import { Events, Message } from "discord.js";

export default {
  name: Events.MessageCreate,

  async execute(message: Message) {

    if (message.author.bot) return;

    if (message.attachments.size === 0) return;

    const file = message.attachments.first();

    if (!file) return;

    if (!file.name?.endsWith(".log")) return;

    console.log("📄 LOG DETECTADO");
    console.log(file.name);

  },
};