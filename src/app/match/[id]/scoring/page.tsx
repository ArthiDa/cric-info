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
import { fetchInningsByMatchId } from "@/lib/data";

export default async function page({ params }: { params: { id: string } }) {
  const matchId = params.id;
  const inningsDetails = await fetchInningsByMatchId(matchId);
  if (inningsDetails === undefined) {
    return <>Failed to load match</>;
  }

  // const [res1, res2] = await Promise.all([
  //   getPlayersWithTeamId(inningsDetails.battingTeamId._id),
  //   getPlayersWithTeamId(inningsDetails.bowlingTeamId._id),
  // ]);

  // const battingTeamPlayers = res1.success ? res1.players : [];
  // const bowlingTeamPlayers = res2.success ? res2.players : [];

  // const [r1, r2] = await Promise.all([
  //   await twoStrikers(inningsDetails._id),
  //   await currentBowler(inningsDetails._id),
  // ]);
  // const strikers: battingScorecard[] = r1.success ? r1.strikers ?? [] : [];
  // const bowler: bowlingScorecard | null = r2.success ? r2.bowler ?? null : null;

  const remBalls = inningsDetails.balls % inningsDetails.ball_in_over;
  const totalOvers = Math.floor(
    inningsDetails.balls / inningsDetails.ball_in_over
  );
  const crr = (
    inningsDetails.runs /
    (totalOvers + remBalls / inningsDetails.ball_in_over)
  ).toFixed(2);

  let remOversToWin;
  let rr;
  let remBallsToWin;
  let need;
  if (inningsDetails.innings_number === 2) {
    remBallsToWin =
      inningsDetails.match_overs * inningsDetails.ball_in_over -
      inningsDetails.balls;
    remOversToWin = Math.floor(remBallsToWin / inningsDetails.ball_in_over);
    const rem =
      (remBallsToWin % inningsDetails.ball_in_over) /
      inningsDetails.ball_in_over;
    need = inningsDetails.target - inningsDetails.runs;
    rr = (need / (remOversToWin + rem)).toFixed(2);
  }

  return (
    <div className="mx-2 pt-5 divide-y-2 flex flex-col gap-4 my-2">
      <div>
        {inningsDetails.innings_number === 1 ? (
          <>
            <h3 className="text-center text-xl font-bold">
              {inningsDetails.batting_team}
            </h3>
            <p className="text-center font-medium">First Innings</p>
          </>
        ) : (
          <>
            <h3 className="text-center text-xl font-bold">
              {inningsDetails.bowling_team}
            </h3>
            <p className="text-center font-medium">Second Innings</p>
          </>
        )}
        <div className="flex justify-center items-center">
          <p className="text-6xl font-bold">{inningsDetails.runs}</p>
          <p className="text-6xl font-bold">-</p>
          <p className="text-6xl font-bold">{inningsDetails.wickets}</p>
        </div>
      </div>
      <div className="pt-2">
        <div className="flex gap-6 justify-center items-center mb-2">
          <p>
            Extras - <span>{inningsDetails.extras}</span>
          </p>
          <p>
            Overs -{" "}
            <span>
              {inningsDetails.balls === 0 ? (
                0.0
              ) : (
                <>
                  {totalOvers}.{remBalls}
                </>
              )}
            </span>
          </p>
          <p>
            CRR - <span>{inningsDetails.balls === 0 ? 0.0 : crr}</span>
          </p>
        </div>
        {inningsDetails.innings_number === 2 ? (
          <div className="flex gap-6 justify-center items-center mb-2">
            <p>
              Target - <span>{inningsDetails.target}</span>
            </p>
            <p>
              Need - <span>{need}</span>
            </p>
            <p>
              RR - <span>{inningsDetails.balls === 0 ? 0.0 : rr}</span>
            </p>
          </div>
        ) : null}
      </div>

      {/* <Scoring
        inningsDetails={inningsDetails}
        battingTeamPlayers={battingTeamPlayers ?? []}
        bowlingTeamPlayers={bowlingTeamPlayers ?? []}
        strikers={strikers ?? []}
        bowler={bowler ?? null}
      /> */}
    </div>
  );
}
