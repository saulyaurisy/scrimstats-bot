import { Events } from "discord.js";

import { commands } from "../utils/CommandLoader.js";
import { Event } from "../types/Event.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {

    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {

      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ Ocurrió un error.",
        });
      } else {
        await interaction.reply({
          content: "❌ Ocurrió un error.",
          ephemeral: true,
        });
      }

    }

  },

} satisfies Event<"interactionCreate">;