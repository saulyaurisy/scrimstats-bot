import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from "discord.js";

import { trainingManager } from "../../core/TrainingManager.js";
import { Command } from "../../types/Command.js";

export default {

    data: new SlashCommandBuilder()
        .setName("training-create")
        .setDescription("Crea un entrenamiento"),

    async execute(interaction: ChatInputCommandInteraction) {

        try {

            const training = trainingManager.createTraining(
                interaction.guildId!,
                interaction.channelId,
                interaction.user.id
            );

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🏆 Entrenamiento creado")
                .addFields(
                    {
                        name: "ID",
                        value: training.id,
                    },
                    {
                        name: "Canal",
                        value: `<#${training.channelId}>`,
                    },
                    {
                        name: "Partidas",
                        value: "0",
                        inline: true
                    },
                    {
                        name: "Equipos",
                        value: "0",
                        inline: true
                    },
                    {
                        name: "Jugadores",
                        value: "0",
                        inline: true
                    }
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

        } catch (err) {

            await interaction.reply({
                content: "❌ Ya existe un entrenamiento activo en este canal.",
                ephemeral: true
            });

        }

    }

} satisfies Command;