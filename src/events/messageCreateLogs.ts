import {
  Events,
  Message,
  EmbedBuilder
} from "discord.js";

import { LogReader } from "../parser/LogReader.js";
import { Parser } from "../parser/Parser.js";
import { trainingManager } from "../core/TrainingManager.js";

export default {
  name: Events.MessageCreate,

  async execute(message: Message) {

      if (message.author.bot) return;

      if (message.attachments.size === 0) return;

      const file = message.attachments.first();

      if (!file) return;

      if (!file.name?.toLowerCase().endsWith(".log")) return;

      console.log("=================================");
      console.log("📄 LOG DETECTADO");
      console.log(`📁 Archivo: ${file.name}`);
      console.log(`🏠 Servidor: ${message.guild?.name}`);
      console.log(`📢 Canal: ${message.channelId}`);
      console.log("=================================");

      const training =
          trainingManager.getTraining(message.channelId);

      if (!training) {

          console.log(
              `⚠️ No existe entrenamiento para el canal ${message.channelId}`
          );

          return;
      }

      await message.reply(
          "📄 Log recibido. Procesando..."
      );

      try {

          console.log("📥 Descargando log...");

          const content =
              await LogReader.read(file.url);

          console.log("✅ Log descargado");

          console.log("🔎 Procesando información...");

          const match =
              Parser.parse(content);

          console.log("✅ Match procesado");

          trainingManager.addMatch(
              message.channelId,
              match
          );

          const matchNumber =
              training.matches.length;

          const winner =
              match.teams[0];

          const mvp =
              [...match.players]
                  .sort(
                      (a, b) =>
                          b.kills - a.kills
                  )[0];

          const embed =
              new EmbedBuilder()

                  .setColor("Green")

                  .setTitle(
                      `✅ Match #${matchNumber} agregada`
                  )

                  .addFields(

                      {
                          name: "🏆 Ganador",
                          value:
                              winner?.name ??
                              "Sin datos",
                          inline: true
                      },

                      {
                          name: "🔥 MVP",
                          value:
                              mvp
                                  ? `${mvp.name}\n${mvp.kills} kills`
                                  : "Sin datos",
                          inline: true
                      },

                      {
                          name: "👥 Equipos",
                          value:
                              match.teams.length
                                  .toString(),
                          inline: true
                      },

                      {
                          name: "🎮 Jugadores",
                          value:
                              match.players.length
                                  .toString(),
                          inline: true
                      }

                  )

                  .setFooter({
                      text:
                          "ScrimStats Bot"
                  })

                  .setTimestamp();

          await message.reply({
              embeds: [embed]
          });

          console.log(
              `✅ Match #${matchNumber} guardada correctamente`
          );

      } catch (error) {

          console.error(
              "❌ Error procesando el log:"
          );

          console.error(error);

          await message.reply(
              "❌ No pude leer ese log."
          );
      }
  }
};