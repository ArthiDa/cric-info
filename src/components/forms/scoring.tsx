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
  InningsBalls,
  InningsWithMatchNTeams,
  Player,
} from "@/lib/definitions";
import { updateBasicScore } from "@/lib/actions";

function getEconomy(
  bowler: BowlingScoresWithPlayer,
  inningsDetails: InningsWithMatchNTeams
) {
  const ballInOver = inningsDetails.ball_in_over;
  const totalOvers = Math.floor(bowler.balls / ballInOver);
  const totalBalls = bowler.balls;
  const remBalls = totalBalls % ballInOver;
  const totalRuns = bowler.runs;
  const eco =
    totalRuns > 0
      ? (totalRuns / (totalOvers + remBalls / ballInOver)).toFixed(2)
      : "0.0";
  return eco;
}

export default function Scoring({
  inningsDetails,
  battingTeamPlayers,
  bowlingTeamPlayers,
  strikers,
  bowler,
  lastSixBalls,
}: {
  inningsDetails: InningsWithMatchNTeams;
  battingTeamPlayers: Player[];
  bowlingTeamPlayers: Player[];
  strikers: BattingScoresWithPlayer[];
  bowler: BowlingScoresWithPlayer | null;
  lastSixBalls: InningsBalls[];
}) {
  const [selectedStriker, setSelectedStriker] =
    useState<BattingScoresWithPlayer | null>(null);

  const handleScoreUpdate = async (score: number) => {
    // Handle the score update here
    if (selectedStriker && bowler && inningsDetails) {
      // Batsman score update
      const isFour = score === 4;
      const isSix = score === 6;
      const inningsFirstBall = inningsDetails.balls === 0;
      try {
        await updateBasicScore(
          score,
          isFour,
          isSix,
          selectedStriker.player_id,
          bowler.player_id,
          inningsDetails,
          inningsFirstBall
        );
        // Reset the selected striker
        setSelectedStriker(null);
      } catch (error) {
        alert("Failed to update score");
      }
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
                  {Math.floor(bowler.balls / inningsDetails.ball_in_over)}.
                  {bowler.balls % inningsDetails.ball_in_over}
                </TableCell>
                <TableCell>{bowler.maidens}</TableCell>
                <TableCell>{bowler.runs}</TableCell>
                <TableCell>{bowler.wickets}</TableCell>
                <TableCell>{getEconomy(bowler, inningsDetails)}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
      {!strikers.length && !bowler ? (
        <>
          <div className="pt-4 flex justify-center items-center gap-2">
            <SelectBatsman
              batsman={battingTeamPlayers || []}
              flag={true}
              inningsId={inningsDetails.id}
              matchId={inningsDetails.match_id}
            />
            <SelectBowler
              bowlers={bowlingTeamPlayers || []}
              inningsId={inningsDetails.id}
              matchId={inningsDetails.match_id}
            />
          </div>
        </>
      ) : strikers.length === 0 ? (
        <div className="pt-4 flex justify-center items-center gap-2">
          <SelectBatsman
            batsman={battingTeamPlayers || []}
            flag={true}
            inningsId={inningsDetails.id}
            matchId={inningsDetails.match_id}
          />
        </div>
      ) : !bowler ? (
        <div className="pt-4 flex justify-center items-center gap-2">
          <SelectBowler
            bowlers={bowlingTeamPlayers || []}
            inningsId={inningsDetails.id}
            matchId={inningsDetails.match_id}
          />
        </div>
      ) : (
        <>
          <div className="pt-2 flex justify-between items-center">
            <div>
              <p>
                {lastSixBalls.map((ball, id) => (
                  <span
                    key={id}
                    className={`border-2 rounded-full p-2 mr-3 ${
                      ball.is_six
                        ? "bg-green-500"
                        : ball.is_four
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {ball.is_wicket ? "W" : ball.runs ? ball.runs : 0}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <Button variant={"outline"}>Over</Button>
            </div>
          </div>
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2">
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
              <div>
                <Button variant={"outline"}>Out</Button>
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
