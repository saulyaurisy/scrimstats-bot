import "dotenv/config";

import {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder
} from "discord.js";

import {
    commands
} from "./utils/CommandLoader.js";

import {
    Parser
} from "./parser/Parser.js";

import {
    LogReader
} from "./parser/LogReader.js";

import {
    trainingManager
} from "./core/TrainingManager.js";

// ========================================
// VARIABLES DE ENTORNO
// ========================================

const token = process.env.DISCORD_TOKEN;

if (!token) {

    throw new Error(
        "❌ DISCORD_TOKEN no está configurado en .env"
    );

}

// ========================================
// CLIENT
// ========================================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});

// ========================================
// BOT READY
// ========================================

client.once(
    Events.ClientReady,
    readyClient => {

        console.log("");
        console.log("========================================");
        console.log("🤖 SCRIMSTATS BOT");
        console.log("========================================");

        console.log(
            `✅ Conectado como ${readyClient.user.tag}`
        );

        console.log(
            `🌎 Servidores: ${readyClient.guilds.cache.size}`
        );

        console.log(
            `📦 Comandos: ${commands.size}`
        );

        console.log("========================================");
        console.log("");

    }
);

// ========================================
// SLASH COMMANDS
// ========================================

client.on(
    Events.InteractionCreate,
    async interaction => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command =
            commands.get(
                interaction.commandName
            );

        if (!command) {

            console.warn(
                `⚠️ Comando no encontrado: /${interaction.commandName}`
            );

            return;
        }

        try {

            await command.execute(
                interaction
            );

        } catch (error) {

            console.error(
                `❌ Error ejecutando /${interaction.commandName}:`,
                error
            );

            try {

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {

                    await interaction.followUp({

                        content:
                            "❌ Ocurrió un error ejecutando el comando."

                    });

                } else {

                    await interaction.reply({

                        content:
                            "❌ Ocurrió un error ejecutando el comando.",

                        ephemeral: true

                    });

                }

            } catch (replyError) {

                console.error(
                    "❌ No pude enviar el mensaje de error:",
                    replyError
                );

            }

        }

    }
);

// ========================================
// RECEPCIÓN DE LOGS
// ========================================

client.on(
    Events.MessageCreate,
    async message => {

        // Ignorar bots

        if (message.author.bot) {
            return;
        }

        // Ignorar mensajes sin archivos

        if (message.attachments.size === 0) {
            return;
        }

        const file =
            message.attachments.first();

        if (!file) {
            return;
        }

        // ========================================
        // COMPROBAR EXTENSIÓN
        // ========================================

        if (
            !file.name
                ?.toLowerCase()
                .endsWith(".log")
        ) {

            return;

        }

        // ========================================
        // COMPROBAR SERVIDOR
        // ========================================

        if (!message.guild) {
            return;
        }

        // ========================================
        // OBTENER ENTRENAMIENTO
        // ========================================

        const training =
            trainingManager.getTraining(
                message.channelId
            );

        if (!training) {
            return;
        }

        // ========================================
        // AVISAR
        // ========================================

        await message.reply(
            "📄 Log recibido. Procesando..."
        );

        try {

            // ========================================
            // LEER LOG
            // ========================================

            const content =
                await LogReader.read(
                    file.url
                );

            // ========================================
            // PARSEAR
            // ========================================

            const match =
                Parser.parse(
                    content
                );

            // ========================================
            // GUARDAR MATCH
            // ========================================

            training.matches.push(
                match
            );

            // ========================================
            // GANADOR
            // ========================================

            const winner =
                match.teams[0];

            // ========================================
            // MVP
            // ========================================

            const mvp =
                [...match.players].sort(
                    (a, b) =>
                        b.kills - a.kills
                )[0];

            // ========================================
            // EMBED
            // ========================================

            const embed =
                new EmbedBuilder()

                    .setColor("Green")

                    .setTitle(
                        `✅ Match #${training.matches.length} agregada`
                    )

                    .addFields(

                        {
                            name: "🏆 Ganador",
                            value:
                                winner?.name ??
                                "Desconocido",
                            inline: true
                        },

                        {
                            name: "🔥 MVP",
                            value:
                                mvp
                                    ? `${mvp.name}\n${mvp.kills} kills`
                                    : "No disponible",
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

                    .setTimestamp();

            // ========================================
            // RESPONDER
            // ========================================

            await message.reply({

                embeds: [
                    embed
                ]

            });

            console.log(
                `✅ Match agregada. Total: ${training.matches.length}`
            );

        } catch (error) {

            console.error(
                "❌ Error procesando log:",
                error
            );

            await message.reply(
                "❌ No pude leer ese log."
            );

        }

    }
);

// ========================================
// LOGIN
// ========================================

client.login(token);