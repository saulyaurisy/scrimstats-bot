import { Collection } from "discord.js";

import { Command } from "../types/Command.js";

import ping from "../commands/ping.js";
import trainingCreate from "../commands/training/create.js";
import trainingEnd from "../commands/training/end.js";

export const commands = new Collection<string, Command>();

commands.set(ping.data.name, ping);
commands.set(trainingCreate.data.name, trainingCreate);
commands.set(trainingEnd.data.name, trainingEnd);