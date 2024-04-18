import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Toss } from "@/components/forms/toss";
import { getMatch } from "@/lib/actions/match.action";
import Link from "next/link";

export default async function MatchAvsB({
  params,
}: {
  params: { id: string };
}) {
  const matchDetails = await getMatch(params.id);
  if (!matchDetails.success) {
    return <>Failed to load match</>;
  }
  const teamNames = {
    teamA: matchDetails.match.teamIdA.teamName,
    teamB: matchDetails.match.teamIdB.teamName,
  };
  const teamIds = {
    teamA: matchDetails.match.teamIdA._id.toString(),
    teamB: matchDetails.match.teamIdB._id.toString(),
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[80%] h-[300px] pt-5 mx-5 md:mx-0">
        <div className=" flex justify-center items-center space-x-10  ">
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{matchDetails?.match?.teamIdA.teamName}</h1>
          </div>
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{matchDetails?.match?.teamIdB.teamName}</h1>
          </div>
        </div>
        <div className="flex flex-col space-y-1 pt-2">
          <h1 className="text-center font-bold">
            Over: {matchDetails?.match?.overs}
          </h1>
          <h1 className="text-center  font-bold">
            Wickets: {matchDetails?.match?.wickets}
          </h1>
        </div>
        <CardFooter>
          <div className="flex justify-center w-full py-5">
            {matchDetails?.match?.toss ? (
              <Link href={`/match/${matchDetails?.match?._id}/scoring`}>
                <Button variant="outline">Start Match</Button>
              </Link>
            ) : (
              <Toss
                teamNames={teamNames}
                teamIds={teamIds}
                matchId={matchDetails?.match?._id}
              />
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
