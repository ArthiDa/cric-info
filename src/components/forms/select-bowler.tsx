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
import { updateBowler } from "@/lib/actions";

export default function SelectBowler({
  bowlers,
  inningsId,
  matchId,
}: {
  bowlers: Player[];
  inningsId: string;
  matchId: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleRowClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = async () => {
    if (selectedPlayer) {
      try {
        await updateBowler(selectedPlayer.id, inningsId, matchId);
        setSelectedPlayer(null);
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
                  key={player.id}
                  onClick={() => handleRowClick(player)}
                  className={
                    selectedPlayer?.player_name === player.player_name
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
                disabled={!selectedPlayer}
              >
                Submit Bowler
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
