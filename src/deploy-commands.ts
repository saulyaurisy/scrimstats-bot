import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands } from "./utils/CommandLoader.js";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

const token = getEnv("DISCORD_TOKEN");
const clientId = getEnv("CLIENT_ID");

const commandData = Array.from(commands.values()).map(
    command => command.data.toJSON()
);

const rest = new REST({
    version: "10"
}).setToken(token);

async function deploy(): Promise<void> {
    try {
        console.log(`Comandos encontrados: ${commandData.length}`);

        await rest.put(
            Routes.applicationCommands(clientId),
            {
                body: commandData
            }
        );

        console.log("Comandos globales registrados correctamente.");

        for (const command of commandData) {
            console.log(`/${command.name}`);
        }

    } catch (error) {
        console.error(error);
    }
}

deploy();