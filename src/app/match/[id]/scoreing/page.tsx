"use client";
import { Button } from "@/components/ui/button";
import useMatchDetailsStore from "@/store/match-details-store";
import React, { use } from "react";

export default function page({ params }: { params: { id: string } }) {
  const score = useMatchDetailsStore((state) => state.totalScore);
  const { teamA, teamB } = useMatchDetailsStore((state) => state);
  const addScore = useMatchDetailsStore((state) => state.addScore);
  return (
    <div>
      {score} {teamA.name} {teamB.name}
      <Button
        onClick={() => {
          addScore(1);
        }}
      >
        Add SCORE
      </Button>
    </div>
  );
}
