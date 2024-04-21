"use client";
import { Button } from "@/components/ui/button";
import React, { use, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SelectBatsman from "./select-batsman";
import SelectBowler from "./select-bowler";
import {
  BattingScoresWithPlayer,
  BowlingScoresWithPlayer,
  InningsWithMatchNTeams,
  Player,
} from "@/lib/definitions";

export default function Scoring({
  inningsDetails,
  battingTeamPlayers,
  bowlingTeamPlayers,
  strikers,
  bowler,
}: {
  inningsDetails: InningsWithMatchNTeams;
  battingTeamPlayers: Player[];
  bowlingTeamPlayers: Player[];
  strikers: BattingScoresWithPlayer[];
  bowler: BowlingScoresWithPlayer | null;
}) {
  let ballInOver;
  let totalOvers;
  let totalBalls;
  let remBalls;
  let totalRuns;
  let eco = "0.0";
  if (bowler && inningsDetails) {
    ballInOver = inningsDetails.ball_in_over;
    totalOvers = Math.floor(bowler.balls / ballInOver);
    totalBalls = bowler.balls;
    remBalls = totalBalls % ballInOver;
    totalRuns = bowler.runs;
    eco = (totalRuns / (totalOvers + remBalls / ballInOver)).toFixed(2);
  }
  const [selectedStriker, setSelectedStriker] =
    useState<BattingScoresWithPlayer | null>(null);

  const handleScoreUpdate = async (score: number) => {
    // Handle the score update here
    console.log(`Score updated: ${score}`, selectedStriker, inningsDetails);
    if (selectedStriker && bowler && inningsDetails) {
      // Batsman score update
      const isFour = score === 4;
      const isSix = score === 6;
      // // Bowler score update
      // const updateBowlerScore = await updateBowlerRun(
      //   inningsDetails._id,
      //   bowler?.playerId._id,
      //   score
      // );
      // if (!updateBowlerScore.success) {
      //   alert("Error updating bowler score");
      // }

      // const updateInningsScore = await updateInningsRuns(
      //   inningsDetails._id,
      //   score
      // );
      // if (!updateInningsScore.success) {
      //   alert("Error updating innings score");
      // }
      // Reset the selected striker
      setSelectedStriker(null);
    }
  };
  return (
    <>
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Batsman</TableHead>
              <TableHead>R</TableHead>
              <TableHead>B</TableHead>
              <TableHead>4s</TableHead>
              <TableHead>6s</TableHead>
              <TableHead>SR</TableHead>
            </TableRow>
          </TableHeader>
          {!strikers.length ? (
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {strikers.map((striker, id) => (
                <TableRow
                  key={id}
                  onClick={() => setSelectedStriker(striker)}
                  className={`cursor-pointer ${
                    selectedStriker?.player_id === striker.player_id
                      ? "bg-orange-400 hover:bg-orange-400"
                      : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    {striker.player_name}
                  </TableCell>
                  <TableCell>{striker.runs}</TableCell>
                  <TableCell>{striker.balls}</TableCell>
                  <TableCell>{striker.fours}</TableCell>
                  <TableCell>{striker.sixes}</TableCell>
                  <TableCell>
                    {striker.balls === 0
                      ? 0.0
                      : ((striker.runs / striker.balls) * 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Bowler</TableHead>
              <TableHead>O</TableHead>
              <TableHead>M</TableHead>
              <TableHead>R</TableHead>
              <TableHead>W</TableHead>
              <TableHead>Eco</TableHead>
            </TableRow>
          </TableHeader>
          {!bowler ? (
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {bowler.player_name}
                </TableCell>
                <TableCell>
                  {totalOvers}.{remBalls}
                </TableCell>
                <TableCell>{bowler.maidens}</TableCell>
                <TableCell>{bowler.runs}</TableCell>
                <TableCell>{bowler.wickets}</TableCell>
                <TableCell>{eco}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
      {strikers.length === 0 && !bowler ? (
        <>
          <div className="pt-4 flex justify-center items-center gap-2">
            <SelectBatsman
              batsman={battingTeamPlayers || []}
              flag={true}
              inningsId={inningsDetails.id}
            />
            <SelectBowler
              bowlers={bowlingTeamPlayers || []}
              inningsId={inningsDetails.id}
            />
          </div>
        </>
      ) : strikers.length === 0 ? (
        <div className="pt-4 flex justify-center items-center gap-2">
          <SelectBatsman
            batsman={battingTeamPlayers || []}
            flag={true}
            inningsId={inningsDetails.id}
          />
        </div>
      ) : !bowler ? (
        <div className="pt-4 flex justify-center items-center gap-2">
          <SelectBowler
            bowlers={bowlingTeamPlayers || []}
            inningsId={inningsDetails.id}
          />
        </div>
      ) : (
        <>
          <div className="pt-2 flex justify-between items-center">
            <div>
              <p>
                <span className="border-2 rounded-full p-2 ml-3">-</span>
                <span className="border-2 rounded-full p-2 ml-3">6</span>
                <span className="border-2 rounded-full p-2 ml-3">3</span>
                <span className="border-2 rounded-full p-2 ml-3">w</span>
                <span className="border-2 rounded-full p-2 ml-3">e10</span>
                <span className="border-2 rounded-full p-2 ml-3">1</span>
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant={"outline"}>Over</Button>
            </div>
          </div>
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2">
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(1)}
                  disabled={!selectedStriker}
                >
                  1
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(2)}
                  disabled={!selectedStriker}
                >
                  2
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(3)}
                  disabled={!selectedStriker}
                >
                  3
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(4)}
                  disabled={!selectedStriker}
                >
                  4
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(5)}
                  disabled={!selectedStriker}
                >
                  5
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(6)}
                  disabled={!selectedStriker}
                >
                  6
                </Button>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => handleScoreUpdate(0)}
                  disabled={!selectedStriker}
                >
                  0
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex">
                <div>
                  <Button variant={"outline"}>Ext</Button>
                </div>
                <div>
                  <Button variant={"outline"} className="mx-7">
                    Bat+Ext
                  </Button>
                </div>
              </div>
              <div className="flex">
                <div>
                  <Button variant={"outline"}>Out</Button>
                </div>
                <div>
                  <Button variant={"outline"} className="ml-7">
                    Undo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
