import { Team } from "./Team.js";
import { Player } from "./Player.js";

export interface Match {
  id: string;

  teams: Team[];

  players: Player[];
}