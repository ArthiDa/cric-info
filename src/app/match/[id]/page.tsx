"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toss } from "@/components/forms/toss";

export default function MatchAvsB({ params }: { params: { id: string } }) {
  const [isTossCompleted, setIsTossCompleted] = useState(false);
  useEffect(() => {}, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px] pt-5 mx-5 md:mx-0">
        <div className=" flex justify-center items-center space-x-10  ">
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>Team 1</h1>
          </div>
          <div className="flex justify-center items-center flex-col space-y-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>Team 2</h1>
          </div>
        </div>
        <div className="flex flex-col space-y-1 pt-2">
          <h1 className="text-center font-bold">Over: 5</h1>
          <h1 className="text-center  font-bold">Wickets: 5</h1>
        </div>
        <CardFooter>
          <div className="flex justify-center w-full py-5">
            {isTossCompleted ? (
              <Button
                onClick={() => {
                  setIsTossCompleted(false);
                }}
              >
                Do Scoring
              </Button>
            ) : (
              <Toss />
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
