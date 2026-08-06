import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";

import { Command } from "../../types/Command.js";
import { trainingManager } from "../../core/TrainingManager.js";
import { RankingCalculator } from "../../core/RankingCalculator.js";

export default {

    data: new SlashCommandBuilder()
        .setName("training-end")
        .setDescription("Finaliza el entrenamiento y muestra el ranking."),

    async execute(interaction: ChatInputCommandInteraction) {

        console.log("========== TRAINING END ==========");

        const training = trainingManager.getTraining(
            interaction.channelId
        );

        if (!training) {

            console.log("No existe entrenamiento.");

            await interaction.reply({
                content: "❌ No hay un entrenamiento activo en este canal.",
                ephemeral: true,
            });

            return;

        }

        console.log("Entrenamiento encontrado.");
        console.log("Partidas:", training.matches.length);

        const ranking = RankingCalculator.calculate(training);

        console.log("Ranking calculado.");
        console.log("Equipos:", ranking.totalTeams);
        console.log("Jugadores:", ranking.totalPlayers);

        const teamsTable =
            ranking.teams.length > 0
                ? ranking.teams
                      .map(
                          (team, index) =>
                              `${index + 1}. ${team.name} — ${team.totalPoints} pts | ${team.totalKills} kills | ${team.wins} wins`
                      )
                      .join("\n")
                : "Sin datos";

        const playersTable =
            ranking.topPlayers.length > 0
                ? ranking.topPlayers
                      .map(
                          (player, index) =>
                              `${index + 1}. ${player.name} — ${player.kills} kills`
                      )
                      .join("\n")
                : "Sin datos";

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🏆 Entrenamiento finalizado")

            .addFields(
                {
                    name: "🎮 Partidas",
                    value: ranking.totalMatches.toString(),
                    inline: true,
                },
                {
                    name: "👥 Equipos",
                    value: ranking.totalTeams.toString(),
                    inline: true,
                },
                {
                    name: "🎯 Jugadores",
                    value: ranking.totalPlayers.toString(),
                    inline: true,
                },
                {
                    name: "🥇 Campeón",
                    value: ranking.champion
                        ? `${ranking.champion.name}\n${ranking.champion.totalPoints} pts`
                        : "Sin datos",
                },
                {
                    name: "👑 MVP",
                    value: ranking.mvp
                        ? `${ranking.mvp.name}\n${ranking.mvp.kills} kills`
                        : "Sin datos",
                },
                {
                    name: "🏆 Clasificación",
                    value: teamsTable,
                },
                {
                    name: "🔥 Top Jugadores",
                    value: playersTable,
                }
            )

            .setTimestamp();

        console.log("Enviando embed...");

        await interaction.reply({
            embeds: [embed],
        });

        console.log("Embed enviado.");

        trainingManager.endTraining(
            interaction.channelId
        );

        console.log("Entrenamiento finalizado.");
        console.log("==============================");

    },

} satisfies Command;