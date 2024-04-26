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
import { updateBasicScore, updateOver } from "@/lib/actions";
import OutTypeForm from "./out-type-form";
import Extra from "./extra";
import More from "./more";

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
  // make an array of dynamic length
  const nonStriker = Array.from({ length: 2 - strikers.length }, (_, i) => i);
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
  const handleEndOver = async () => {
    try {
      if (!bowler) {
        throw new Error("No bowler found");
      }
      confirm("Are you sure you want to end the over?")
        ? await updateOver(
            inningsDetails.id,
            bowler.id,
            inningsDetails.match_id
          )
        : null;
    } catch (error) {
      alert("Failed to end over");
      return;
    }
  };
  const scores = [1, 2, 3, 4, 5, 6, 0];
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

          <TableBody>
            {strikers?.map((striker, id) => (
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

            {nonStriker.map((_, id) => (
              <TableRow key={id}>
                <TableCell className="font-medium">-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Bowler</TableHead>
              <TableHead>O</TableHead>
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
              inningsDetails={inningsDetails}
            />
            <SelectBowler
              bowlers={bowlingTeamPlayers || []}
              inningsId={inningsDetails.id}
              matchId={inningsDetails.match_id}
            />
          </div>
        </>
      ) : strikers.length != 2 ? (
        <div className="pt-4 flex justify-center items-center gap-2">
          <SelectBatsman
            batsman={battingTeamPlayers || []}
            flag={strikers.length === 1 ? false : true}
            inningsDetails={inningsDetails}
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
                    className={`border-2 rounded-full p-2 mr-2 ${
                      ball.is_six
                        ? "bg-green-500"
                        : ball.is_four
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {ball.is_wicket
                      ? ball.runs
                        ? `${ball.runs}W`
                        : "W"
                      : ball.runs
                      ? ball.runs
                      : 0}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <Button variant={"outline"} onClick={() => handleEndOver()}>
                Over
              </Button>
            </div>
          </div>
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2">
              {scores.map((score, id) => (
                <div key={id}>
                  <Button
                    variant={"outline"}
                    onClick={() => handleScoreUpdate(score)}
                    disabled={!selectedStriker}
                  >
                    {score}
                  </Button>
                </div>
              ))}
              <div>
                <OutTypeForm
                  inningDetails={inningsDetails}
                  striker={selectedStriker ? selectedStriker : null}
                  bowler={bowler ? bowler : null}
                  strikers={strikers}
                />
              </div>
            </div>
            <div className="flex justify-center items-center pt-2 gap-4">
              <div>
                <Extra
                  inningDetails={inningsDetails}
                  bowler={bowler ? bowler : null}
                />
              </div>
              <div>
                <More
                  inningDetails={inningsDetails}
                  bowler={bowler ? bowler : null}
                  strikers={strikers}
                />
              </div>
              <div>
                <Button variant={"outline"}>Undo</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
