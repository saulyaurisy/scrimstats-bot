import { Match } from "./Match.js";

export interface Training {

    id: string;

    guildId: string;

    channelId: string;

    createdBy: string;

    createdAt: Date;

    /**
     * Todas las partidas del entrenamiento
     */
    matches: Match[];

}