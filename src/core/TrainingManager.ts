import { randomUUID } from "crypto";

import { Training } from "../models/Training.js";
import { Match } from "../models/Match.js";

class TrainingManager {

    private trainings = new Map<string, Training>();

    /**
     * Crear entrenamiento
     */
    createTraining(
        guildId: string,
        channelId: string,
        createdBy: string
    ): Training {

        if (this.trainings.has(channelId)) {
            throw new Error("Ya existe un entrenamiento activo.");
        }

        const training: Training = {

            id: randomUUID(),

            guildId,

            channelId,

            createdBy,

            createdAt: new Date(),

            matches: []

        };

        this.trainings.set(channelId, training);

        return training;

    }

    /**
     * ¿Existe entrenamiento?
     */
    hasTraining(channelId: string): boolean {

        return this.trainings.has(channelId);

    }

    /**
     * Obtener entrenamiento
     */
    getTraining(channelId: string): Training | undefined {

        return this.trainings.get(channelId);

    }

    /**
     * Agregar una partida
     */
    addMatch(
        channelId: string,
        match: Match
    ): void {

        const training = this.trainings.get(channelId);

        if (!training) {
            throw new Error("No existe un entrenamiento activo.");
        }

        training.matches.push(match);

    }

    /**
     * Cantidad de partidas
     */
    getMatchCount(channelId: string): number {

        const training = this.trainings.get(channelId);

        if (!training) return 0;

        return training.matches.length;

    }

    /**
     * Finalizar entrenamiento
     */
    endTraining(channelId: string): Training | undefined {

        const training = this.trainings.get(channelId);

        if (!training) return undefined;

        this.trainings.delete(channelId);

        return training;

    }

    /**
     * Cancelar entrenamiento
     */
    removeTraining(channelId: string): boolean {

        return this.trainings.delete(channelId);

    }

}

export const trainingManager = new TrainingManager();