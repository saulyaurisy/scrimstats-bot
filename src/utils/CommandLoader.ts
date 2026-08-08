import ping from "../commands/ping.js";
import trainingCreate from "../commands/training/create.js";
import trainingEnd from "../commands/training/end.js";

export const commands = new Map();

commands.set(
    ping.data.name,
    ping
);

commands.set(
    trainingCreate.data.name,
    trainingCreate
);

commands.set(
    trainingEnd.data.name,
    trainingEnd
);

console.log(
    `📦 ${commands.size} comandos cargados.`
);