"use client";
import React, { useState } from "react";
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
import {
  BattingScoresWithPlayer,
  BowlingScoresWithPlayer,
  InningsWithMatchNTeams,
} from "@/lib/definitions";
import { updateBasicOut } from "@/lib/actions";
import { outTypeDrawerOpenAtom } from "@/lib/store";
import { useAtom } from "jotai";
import RunOut from "./run-out";

export default function OutTypeForm({
  inningDetails,
  striker,
  bowler,
  strikers,
}: {
  inningDetails: InningsWithMatchNTeams;
  striker: BattingScoresWithPlayer | null;
  bowler: BowlingScoresWithPlayer | null;
  strikers: BattingScoresWithPlayer[];
}) {
  const [outTypeDrawerOpen, setOutTypeDrawerOpen] = useAtom(
    outTypeDrawerOpenAtom
  );

  const bowlerOutType = ["Bowled", "Caught", "LBW", "Hit Out"];

  const handleBowlerOut = async (value: string) => {
    try {
      if (striker && bowler) {
        await updateBasicOut(
          inningDetails,
          striker.player_id,
          bowler.player_id,
          value
        );
      }
      setOutTypeDrawerOpen(false);
    } catch (error) {
      alert("Error in selecting out type");
    }
  };

  return (
    <Drawer open={outTypeDrawerOpen} onOpenChange={setOutTypeDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" disabled={!striker}>
          Out
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Select Out Type</DrawerTitle>
        </DrawerHeader>

        <div className="pt-2 grid grid-rows-2 gap-3">
          <div className="flex justify-center items-center gap-2">
            {bowlerOutType.map((type, id) => (
              <Button
                key={id}
                onClick={() => handleBowlerOut(type)}
                variant="outline"
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline">Stumped</Button>
            <RunOut
              inningDetails={inningDetails}
              striker={striker ? striker : null}
              bowler={bowler ? bowler : null}
              strikers={strikers}
            />
            <Button variant="outline">Retried</Button>
          </div>
        </div>
        <DrawerFooter className="py-2" />
      </DrawerContent>
    </Drawer>
  );
}
