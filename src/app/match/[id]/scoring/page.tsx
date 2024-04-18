import { Button } from "@/components/ui/button";
import React, { use } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getInningsByMatchId } from "@/lib/actions/innings.action";
import SelectBowler from "@/components/forms/select-bowler";
import { getPlayersWithTeamId } from "@/lib/actions/player.action";
import { bowlingScorecard, inningsWithMatch, player } from "@/lib/definitions";
import SelectBatsman from "@/components/forms/select-batsman";
import { twoStrikers } from "@/lib/actions/batting.action";
import { battingScorecard } from "@/lib/definitions";
import Scoring from "@/components/forms/scoring";
import { currentBowler } from "@/lib/actions/bowling.action";

export default async function page({ params }: { params: { id: string } }) {
  const matchId = params.id;
  const data = await getInningsByMatchId(matchId);
  if (!data.success) {
    return <>Failed to load innings</>;
  }
  const inningsDetails = data.inningsWithMatch as inningsWithMatch;

  const [res1, res2] = await Promise.all([
    getPlayersWithTeamId(inningsDetails.battingTeamId._id),
    getPlayersWithTeamId(inningsDetails.bowlingTeamId._id),
  ]);

  const battingTeamPlayers = res1.success ? res1.players : [];
  const bowlingTeamPlayers = res2.success ? res2.players : [];

  const [r1, r2] = await Promise.all([
    await twoStrikers(inningsDetails._id),
    await currentBowler(inningsDetails._id),
  ]);
  const strikers: battingScorecard[] = r1.success ? r1.strikers ?? [] : [];
  const bowler: bowlingScorecard | null = r2.success ? r2.bowler ?? null : null;

  const remBalls =
    inningsDetails?.totalBalls % inningsDetails?.matchId.ballInOver;

  const totalOvers = Math.floor(
    inningsDetails?.totalBalls / inningsDetails?.matchId.ballInOver
  );

  const crr = (
    inningsDetails?.totalRuns /
    (totalOvers + remBalls / inningsDetails?.matchId.ballInOver)
  ).toFixed(2);

  let remOversToWin;
  let rr;
  let remBallsToWin;
  let need;
  if (inningsDetails?.inningsNumber === 2) {
    remBallsToWin =
      inningsDetails?.matchId.overs * inningsDetails?.matchId.ballInOver -
      inningsDetails?.totalBalls;
    remOversToWin = Math.floor(
      remBallsToWin / inningsDetails?.matchId.ballInOver
    );
    const rem =
      (remBallsToWin % inningsDetails?.matchId.ballInOver) /
      inningsDetails?.matchId.ballInOver;
    need = inningsDetails?.target - inningsDetails?.totalRuns;
    rr = (need / (remOversToWin + rem)).toFixed(2);
  }

  return (
    <div className="mx-2 pt-5 divide-y-2 flex flex-col gap-4 my-2">
      <div>
        {inningsDetails?.inningsNumber === 1 ? (
          <>
            <h3 className="text-center text-xl font-bold">
              {inningsDetails.battingTeamId?.teamName}
            </h3>
            <p className="text-center font-medium">First Innings</p>
          </>
        ) : (
          <>
            <h3 className="text-center text-xl font-bold">
              {inningsDetails?.bowlingTeamId?.teamName}
            </h3>
            <p className="text-center font-medium">Second Innings</p>
          </>
        )}
        <div className="flex justify-center items-center">
          <p className="text-6xl font-bold">{inningsDetails?.totalRuns}</p>
          <p className="text-6xl font-bold">-</p>
          <p className="text-6xl font-bold">{inningsDetails?.totalWickets}</p>
        </div>
      </div>
      <div className="pt-2">
        <div className="flex gap-6 justify-center items-center mb-2">
          <p>
            Extras - <span>{inningsDetails?.totalExtras}</span>
          </p>
          <p>
            Overs -{" "}
            <span>
              {inningsDetails?.totalBalls === 0 ? (
                0.0
              ) : (
                <>
                  {totalOvers}.{remBalls}
                </>
              )}
            </span>
          </p>
          <p>
            CRR - <span>{inningsDetails?.totalBalls === 0 ? 0.0 : crr}</span>
          </p>
        </div>
        {inningsDetails?.inningsNumber === 2 ? (
          <div className="flex gap-6 justify-center items-center mb-2">
            <p>
              Target - <span>{inningsDetails?.target}</span>
            </p>
            <p>
              Need - <span>{need}</span>
            </p>
            <p>
              RR - <span>{inningsDetails?.totalBalls === 0 ? 0.0 : rr}</span>
            </p>
          </div>
        ) : null}
      </div>

      <Scoring
        inningsDetails={inningsDetails}
        battingTeamPlayers={battingTeamPlayers ?? []}
        bowlingTeamPlayers={bowlingTeamPlayers ?? []}
        strikers={strikers ?? []}
        bowler={bowler ?? null}
      />
    </div>
  );
}
