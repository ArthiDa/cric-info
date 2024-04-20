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
import Link from "next/link";
import { fetchInningsByMatchId, fetchMatch } from "@/lib/data";

export default async function page({ params }: { params: { id: string } }) {
  const fetchInnings = await fetchInningsByMatchId(params.id);
  const matchDetails = await fetchMatch(params.id);
  if (matchDetails === undefined) {
    return <>Failed to load match</>;
  }
  const teamNames = {
    teamA: matchDetails.teama_name,
    teamB: matchDetails.teamb_name,
  };
  const teamIds = {
    teamA: matchDetails.teama_id,
    teamB: matchDetails.teamb_id,
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[80%]  pt-5 mx-5 md:mx-0">
        <div className=" flex justify-center items-center space-x-10  ">
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{matchDetails.teama_name}</h1>
          </div>
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>{matchDetails.teamb_name}</h1>
          </div>
        </div>
        <div className="flex flex-col space-y-1 pt-2">
          <h1 className="text-center font-bold">Over: {matchDetails.overs}</h1>
          <h1 className="text-center  font-bold">
            Wickets: {matchDetails.wickets}
          </h1>
        </div>
        <CardFooter>
          <div className="flex justify-center w-full py-3">
            {matchDetails.toss ? (
              <Link href={`/match/${matchDetails.id}/scoring`}>
                <Button variant="outline">Start Match</Button>
              </Link>
            ) : (
              <Toss
                teamNames={teamNames}
                teamIds={teamIds}
                matchId={matchDetails?.id}
              />
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
