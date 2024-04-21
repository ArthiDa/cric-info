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
import {
  fetchCurrentBowler,
  fetchCurrentStrikers,
  fetchInningsByMatchId,
  fetchPlayersWithTeamId,
} from "@/lib/data";
import Scoring from "@/components/forms/scoring";
import { InningsWithMatchNTeams } from "@/lib/definitions";

function getCurrentRunRate(inningsDetails: InningsWithMatchNTeams) {
  const remBalls = inningsDetails.balls % inningsDetails.ball_in_over;
  const totalOvers = Math.floor(
    inningsDetails.balls / inningsDetails.ball_in_over
  );
  const crr =
    inningsDetails.runs && totalOvers + remBalls
      ? (
          inningsDetails.runs /
          (totalOvers + remBalls / inningsDetails.ball_in_over)
        ).toFixed(2)
      : 0.0;
  return crr;
}

function getRequiredRunRate(inningsDetails: InningsWithMatchNTeams) {
  const remBallsToWin =
    inningsDetails.match_overs * inningsDetails.ball_in_over -
    inningsDetails.balls;
  const remOversToWin = Math.floor(remBallsToWin / inningsDetails.ball_in_over);
  const rem =
    (remBallsToWin % inningsDetails.ball_in_over) / inningsDetails.ball_in_over;
  const need = inningsDetails.target - inningsDetails.runs;
  const rr = need ? (need / (remOversToWin + rem)).toFixed(2) : "0.0";
  return rr;
}

export default async function page({ params }: { params: { id: string } }) {
  const matchId = params.id;
  const inningsDetails = await fetchInningsByMatchId(matchId);
  if (inningsDetails === undefined) {
    return <>Failed to load match</>;
  }

  const [battingTeamPlayers, bowlingTeamPlayers] = await Promise.all([
    fetchPlayersWithTeamId(inningsDetails.batting_team_id),
    fetchPlayersWithTeamId(inningsDetails.bowling_team_id),
  ]);

  const [currentStrikers, currentBowler] = await Promise.all([
    fetchCurrentStrikers(inningsDetails.id),
    fetchCurrentBowler(inningsDetails.id),
  ]);

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
                  {Math.floor(
                    inningsDetails.balls / inningsDetails.ball_in_over
                  )}
                  .{inningsDetails.balls % inningsDetails.ball_in_over}
                </>
              )}
            </span>
          </p>
          <p>
            CRR - <span>{getCurrentRunRate(inningsDetails)}</span>
          </p>
        </div>
        {inningsDetails.innings_number === 2 ? (
          <div className="flex gap-6 justify-center items-center mb-2">
            <p>
              Target - <span>{inningsDetails.target}</span>
            </p>
            <p>
              Need - <span>{inningsDetails.target - inningsDetails.runs}</span>
            </p>
            <p>
              RR - <span>{getRequiredRunRate(inningsDetails)}</span>
            </p>
          </div>
        ) : null}
      </div>

      <Scoring
        inningsDetails={inningsDetails}
        battingTeamPlayers={battingTeamPlayers ? battingTeamPlayers : []}
        bowlingTeamPlayers={bowlingTeamPlayers ? bowlingTeamPlayers : []}
        strikers={currentStrikers ? currentStrikers : []}
        bowler={currentBowler ? currentBowler : null}
      />
    </div>
  );
}
