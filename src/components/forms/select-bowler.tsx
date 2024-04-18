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
import { createBowlingScorecard } from "@/lib/actions/bowling.action";

export default function SelectBowler({
  bowlers,
  inningsId,
}: {
  bowlers: player[];
  inningsId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<player | null>(null);

  const handleRowClick = (player: player) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = async () => {
    if (selectedPlayer) {
      try {
        await createBowlingScorecard({
          inningsId,
          playerId: selectedPlayer._id,
        });
        setOpen(false);
      } catch (error) {
        alert("Error in selecting bowler");
      }
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Select Bowler</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Select Bowler</DrawerTitle>
          </DrawerHeader>
          <Table className="text-center">
            <TableBody>
              {bowlers.map((player) => (
                <TableRow
                  key={player._id}
                  onClick={() => handleRowClick(player)}
                  // @ts-ignore
                  selected={selectedPlayer?.playerName === player.playerName}
                  className={
                    selectedPlayer?.playerName === player.playerName
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
            <Button onClick={handleSubmit} disabled={!selectedPlayer}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
