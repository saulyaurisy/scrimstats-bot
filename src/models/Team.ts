import { Player } from "./Player.js";

export interface Team {
  name: string;
  rank: number;
  killScore: number;
  rankScore: number;
  totalScore: number;

  players: Player[];
}