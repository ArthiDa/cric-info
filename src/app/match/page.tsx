import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMatches } from "@/lib/actions/match.action";
import { matchWithTeams } from "@/lib/definitions";
import Link from "next/link";

export default async function Page() {
  const data = await getMatches();
  // @ts-ignore
  const matches: matchWithTeams[] = data.matches;
  return (
    <>
      <div className="flex flex-col gap-3 md:w-1/2 w-4/5 mx-auto mt-4">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl text-center font-semibold tracking-tight transition-colors first:mt-0">
          Matches
        </h2>
        {matches?.map((match: matchWithTeams) => (
          <Link href={`/match/${match._id}`} key={match._id}>
            <Card key={match._id}>
              <CardHeader>
                <CardDescription className="text-red-600">
                  Live Match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>{match.teamIdA.teamName}</p>
                </div>
                <div className="flex flex-row gap-2 items-center mt-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>{match.teamIdB.teamName}</p>
                </div>
              </CardContent>
              <CardFooter>
                <p>View the match</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
