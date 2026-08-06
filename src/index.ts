import {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder
} from "discord.js";

import dotenv from "dotenv";

import { commands } from "./utils/CommandLoader.js";
import { Parser } from "./parser/Parser.js";
import { LogReader } from "./parser/LogReader.js";
import { trainingManager } from "./core/TrainingManager.js";

dotenv.config();

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ ${client.user?.tag} conectado`);
});

/* ===========================
 SLASH COMMANDS
=========================== */

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {

      await command.execute(interaction);

  } catch (error) {

      console.error(error);

      if (interaction.replied || interaction.deferred) {

          await interaction.followUp({
              content: "❌ Ocurrió un error."
          });

      } else {

          await interaction.reply({
              content: "❌ Ocurrió un error.",
              ephemeral: true
          });

      }

  }

});

/* ===========================
 RECEPCIÓN DE LOGS
=========================== */

client.on(Events.MessageCreate, async message => {

  if (message.author.bot) return;

  if (message.attachments.size === 0) return;

  const file = message.attachments.first();

  if (!file) return;

  if (!file.name?.toLowerCase().endsWith(".log")) return;

  const training = trainingManager.getTraining(message.channelId);

  if (!training) return;

  await message.reply("📄 Log recibido. Procesando...");

  try {

      const content = await LogReader.read(file.url);

      const match = Parser.parse(content);

      training.matches.push(match);

      const winner = match.teams[0];

      const mvp = [...match.players].sort(
          (a, b) => b.kills - a.kills
      )[0];

      const embed = new EmbedBuilder()

          .setColor("Green")

          .setTitle(`✅ Match #${training.matches.length} agregada`)

          .addFields(

              {
                  name: "🏆 Ganador",
                  value: winner.name,
                  inline: true
              },

              {
                  name: "🔥 MVP",
                  value: `${mvp.name}\n${mvp.kills} kills`,
                  inline: true
              },

              {
                  name: "👥 Equipos",
                  value: match.teams.length.toString(),
                  inline: true
              },

              {
                  name: "🎮 Jugadores",
                  value: match.players.length.toString(),
                  inline: true
              }

          )

          .setTimestamp();

      await message.reply({

          embeds: [embed]

      });

      console.log(
          `Match agregada. Total: ${training.matches.length}`
      );

  } catch (err) {

      console.error(err);

      await message.reply(
          "❌ No pude leer ese log."
      );

  }

});

client.login(process.env.DISCORD_TOKEN);