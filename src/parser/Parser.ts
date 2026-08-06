import { randomUUID } from "crypto";

import { Match } from "../models/Match.js";
import { Team } from "../models/Team.js";
import { Player } from "../models/Player.js";

export class Parser {

    static parse(content: string): Match {

        const lines = content.split(/\r?\n/);

        const teams: Team[] = [];
        const players: Player[] = [];

        let currentTeam: Team | null = null;

        for (const line of lines) {

            if (line.startsWith("TeamName:")) {

                const regex =
                    /TeamName:\s*(.*?)\s+Rank:\s*(\d+)\s+KillScore:\s*(\d+)\s+RankScore:\s*(\d+)\s+TotalScore:\s*(\d+)/;

                const match = line.match(regex);

                if (!match) continue;

                currentTeam = {
                    name: match[1].trim(),
                    rank: Number(match[2]),
                    killScore: Number(match[3]),
                    rankScore: Number(match[4]),
                    totalScore: Number(match[5]),
                    players: []
                };

                teams.push(currentTeam);

                continue;
            }

            if (line.startsWith("NAME:")) {

                if (!currentTeam) continue;

                const regex =
                    /NAME:\s*(.*?)\s+ID:\s*(\d+)\s+KILL:\s*(\d+)/;

                const match = line.match(regex);

                if (!match) continue;

                const player: Player = {
                    name: match[1].trim(),
                    id: match[2],
                    kills: Number(match[3])
                };

                currentTeam.players.push(player);
                players.push(player);
            }
        }

        return {
            id: randomUUID(),
            teams,
            players
        };
    }

}