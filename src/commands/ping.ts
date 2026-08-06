import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
  } from "discord.js";
  
  import { Command } from "../types/Command.js";
  
  export default {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Comprueba si el bot está activo"),
  
    async execute(interaction: ChatInputCommandInteraction) {
      await interaction.reply("🏓 Pong!");
    },
  } satisfies Command;