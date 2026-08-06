import { Training } from "../models/Training.js";
import { PlayerStats } from "../models/PlayerStats.js";
import { TeamStats } from "../models/TeamStats.js";

export class RankingCalculator {

    static calculate(training: Training) {

        const players = new Map<string, PlayerStats>();
        const teams = new Map<string, TeamStats>();

        for (const match of training.matches) {

            for (const team of match.teams) {

                let teamStats = teams.get(team.name);

                if (!teamStats) {

                    teamStats = {
                        name: team.name,
                        totalPoints: 0,
                        totalKills: 0,
                        wins: 0,
                        matches: 0
                    };

                    teams.set(team.name, teamStats);

                }

                teamStats.totalPoints += team.totalScore;
                teamStats.totalKills += team.killScore;
                teamStats.matches++;

                if (team.rank === 1) {
                    teamStats.wins++;
                }

                for (const player of team.players) {

                    let playerStats = players.get(player.id);

                    if (!playerStats) {

                        playerStats = {
                            id: player.id,
                            name: player.name,
                            kills: 0,
                            matches: 0,
                            wins: 0
                        };

                        players.set(player.id, playerStats);

                    }

                    playerStats.kills += player.kills;
                    playerStats.matches++;

                    if (team.rank === 1) {
                        playerStats.wins++;
                    }

                }

            }

        }

        const sortedTeams = [...teams.values()].sort((a, b) => {

            if (b.totalPoints !== a.totalPoints)
                return b.totalPoints - a.totalPoints;

            if (b.wins !== a.wins)
                return b.wins - a.wins;

            return b.totalKills - a.totalKills;

        });

        const sortedPlayers = [...players.values()].sort((a, b) => {

            if (b.kills !== a.kills)
                return b.kills - a.kills;

            if (b.wins !== a.wins)
                return b.wins - a.wins;

            return b.matches - a.matches;

        });

        return {

            teams: sortedTeams,

            players: sortedPlayers,

            champion: sortedTeams[0] ?? null,

            mvp: sortedPlayers[0] ?? null,

            topTeams: sortedTeams.slice(0, 5),

            topPlayers: sortedPlayers.slice(0, 5),

            totalMatches: training.matches.length,

            totalTeams: sortedTeams.length,

            totalPlayers: sortedPlayers.length

        };

    }

}