import "dotenv/config";
import { REST, Routes } from "discord.js";

import ping from "./commands/ping.js";
import trainingCreate from "./commands/training/create.js";
import trainingEnd from "./commands/training/end.js";

const commands = [
  ping.data.toJSON(),
  trainingCreate.data.toJSON(), 
  trainingEnd.data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_TOKEN!
);

async function deploy() {
  try {
    console.log("🔄 Registrando comandos...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      {
        body: commands,
      }
    );

    console.log("✅ Comandos registrados correctamente.");
  } catch (error) {
    console.error("❌ Error registrando comandos:");
    console.error(error);
  }
}

deploy();