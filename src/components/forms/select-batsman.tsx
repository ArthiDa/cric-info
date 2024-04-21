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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "../ui/label";
import { Player } from "@/lib/definitions";
import { updateStrikers } from "@/lib/actions";

export default function SelectBatsman({
  batsman,
  flag,
  inningsId,
  matchId,
}: {
  batsman: Player[];
  flag: boolean;
  inningsId: string;
  matchId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const handleRowClick = (player: Player) => {
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
        const strikeraId = selectedPlayers[0].id;
        const strikerbId = selectedPlayers[1]?.id;
        await updateStrikers(strikeraId, strikerbId, inningsId, matchId);
        setSelectedPlayers([]);
        setOpen(false);
      } catch (error) {
        alert("Error in selecting batsman");
      }
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
                  key={player.id}
                  onClick={() => handleRowClick(player)}
                  className={
                    selectedPlayers.some(
                      (p) => p.player_name === player.player_name
                    )
                      ? "bg-orange-400 hover:bg-orange-400"
                      : ""
                  }
                >
                  <TableCell>{player.player_name}</TableCell>
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
                disabled={
                  flag
                    ? selectedPlayers.length !== 2
                    : selectedPlayers.length !== 1
                }
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
