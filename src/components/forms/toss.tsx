"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { updateToss } from "@/lib/actions/match.action";
import { createInnings } from "@/lib/actions/innings.action";

export function Toss({
  teamNames,
  teamIds,
  matchId,
}: {
  teamNames: { teamA: string; teamB: string };
  teamIds: { teamA: string; teamB: string };
  matchId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB" | null>(
    null
  );
  const [selectedDecision, setSelectedDecision] = useState<
    "bat" | "bowl" | null
  >(null);

  const handleTeamSelection = (value: "teamA" | "teamB") => {
    setSelectedTeam(value);
  };

  const handleDecisionSelection = (value: "bat" | "bowl") => {
    setSelectedDecision(value);
  };

  const handleSubmit = async () => {
    if (selectedTeam && selectedDecision) {
      let battingTeamId = "";
      let bowlingTeamId = "";
      if (selectedTeam === "teamA") {
        if (selectedDecision === "bat") {
          battingTeamId = teamIds.teamA;
          bowlingTeamId = teamIds.teamB;
        } else {
          battingTeamId = teamIds.teamB;
          bowlingTeamId = teamIds.teamA;
        }
      } else {
        if (selectedDecision === "bat") {
          battingTeamId = teamIds.teamB;
          bowlingTeamId = teamIds.teamA;
        } else {
          battingTeamId = teamIds.teamA;
          bowlingTeamId = teamIds.teamB;
        }
      }
      try {
        const [res1, res2] = await Promise.all([
          updateToss(matchId, true),
          createInnings({
            matchId,
            battingTeamId,
            bowlingTeamId,
            status: "live",
            inningsNumber: 1,
          }),
        ]);
      } catch (e) {
        alert("Failed to start match");
      }
    } else {
      alert("Please select a team and decision to continue");
      return;
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Toss</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Who won the toss?</DrawerTitle>
        </DrawerHeader>
        <div className="flex justify-center items-center space-x-10 mt-8">
          <div
            className={cn(
              "flex justify-center items-center flex-col space-y-2 cursor-pointer p-6 rounded-lg",
              selectedTeam === "teamA" && "bg-gray-200  p-6 rounded-lg"
            )}
            onClick={() => handleTeamSelection("teamA")}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-bold">{teamNames.teamA}</h1>
          </div>
          <div
            className={cn(
              "flex justify-center items-center flex-col space-y-2 cursor-pointer p-6  rounded-lg",
              selectedTeam === "teamB" && "bg-gray-200  p-6 rounded-lg"
            )}
            onClick={() => handleTeamSelection("teamB")}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-bold">{teamNames.teamB}</h1>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-10 mt-8">
          <div
            className={cn(
              "flex justify-center items-center flex-col space-y-2 cursor-pointer p-4 rounded-md",
              selectedDecision === "bat" && "bg-gray-200 p-4 rounded-md"
            )}
            onClick={() => handleDecisionSelection("bat")}
          >
            <h1 className="text-lg font-bold">Bat</h1>
          </div>
          <div
            className={cn(
              "flex justify-center items-center flex-col space-y-2 cursor-pointer p-4 rounded-md",
              selectedDecision === "bowl" && "bg-gray-200 p-4 rounded-md"
            )}
            onClick={() => handleDecisionSelection("bowl")}
          >
            <h1 className="text-lg font-bold">Bowl</h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <Button className="w-1/2 sm:w-auto" onClick={handleSubmit}>
            Start Scoring
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-1/2 sm:w-auto">
              Cancel
            </Button>
          </DrawerClose>
        </div>

        <DrawerFooter className="pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
