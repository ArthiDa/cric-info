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
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { player } from "@/lib/definitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "../ui/label";
import { createBattingScorecard } from "@/lib/actions/batting.action";

export default function SelectBatsman({
  batsman,
  flag,
  inningsId,
}: {
  batsman: player[];
  flag: boolean;
  inningsId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<player[]>([]);

  const handleRowClick = (player: player) => {
    if (flag) {
      // Allow selecting up to two players
      if (selectedPlayers.length < 2) {
        setSelectedPlayers([...selectedPlayers, player]);
      } else {
        // Remove the previously selected player
        setSelectedPlayers([
          ...selectedPlayers.slice(0, selectedPlayers.length - 1),
          player,
        ]);
      }
    } else {
      // Allow selecting only one player
      setSelectedPlayers([player]);
    }
  };

  const handleSubmit = async () => {
    if (selectedPlayers.length > 0) {
      try {
        for (let i = 0; i < selectedPlayers.length; i++) {
          await createBattingScorecard({
            inningsId,
            playerId: selectedPlayers[i]._id,
          });
        }
      } catch (err) {
        alert("Failed to create batting scorecard");
      }
      setOpen(false);
    } else {
      if (flag) {
        alert("Please select two players");
      } else {
        alert("Please select a player");
      }
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Select Batsman</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Select Batsman</DrawerTitle>
          </DrawerHeader>
          <Table className="text-center">
            <TableBody>
              {batsman.map((player) => (
                <TableRow
                  key={player._id}
                  onClick={() => handleRowClick(player)}
                  // @ts-ignore
                  selected={selectedPlayers.some(
                    (p) => p.playerName === player.playerName
                  )}
                  className={
                    selectedPlayers.some(
                      (p) => p.playerName === player.playerName
                    )
                      ? "bg-gray-300 hover:bg-gray-300"
                      : ""
                  }
                >
                  <TableCell>{player.playerName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DrawerFooter className="pt-2">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                type="submit"
                className="w-1/2 sm:w-auto"
                onClick={handleSubmit}
                disabled={selectedPlayers.length === 0}
              >
                Submit Batsman
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-1/2 sm:w-auto">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}