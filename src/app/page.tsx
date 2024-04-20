import Image from "next/image";
import { CreateTeamForm } from "@/components/forms/create-team";
import { CreatePlayerForm } from "@/components/forms/create-player";
import { CreateMatchForm } from "@/components/forms/create-match";
import { fetchTeams } from "@/lib/data";

export default async function Home() {
  const teams = await fetchTeams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Cricket Scoreboard
      </h1>
      <div className="space-y-4">
        <div className="flex md:flex-row flex-col items-center justify-center gap-5">
          <CreateTeamForm />
          <CreateMatchForm teams={teams || []} />
          <CreatePlayerForm teams={teams || []} />
        </div>
      </div>
    </div>
  );
}
