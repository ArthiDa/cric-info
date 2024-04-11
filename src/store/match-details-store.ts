import { create } from "zustand";
interface MatchDetailsStore {
  teamA: { name: string; players: number[] };
  teamB: { name: string; players: number[] };
  totalScore: number;
  addScore: (score: number) => void;
}
const useMatchDetailsStore = create<MatchDetailsStore>((set) => ({
  teamA: { name: "Team A", players: [1, 2, 3] },
  teamB: { name: "Team B", players: [4, 5, 6] },
  totalScore: 0,
  addScore: (score: number) =>
    set((state: { totalScore: number }) => ({
      totalScore: state.totalScore + score,
    })),
}));

export default useMatchDetailsStore;
