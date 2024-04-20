"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { Team } from "@/lib/definitions";
import { createPlayer } from "@/lib/actions";

const createPlayerFormSchema = z.object({
  playerName: z
    .string()
    .min(2, {
      message: "Team name should be at least 2 characters long",
    })
    .max(50, {
      message: "Team name should not exceed 50 characters",
    }),
  teamName: z
    .string()
    .min(2, {
      message: "Team color should be at least 2 characters long",
    })
    .max(50, {
      message: "Team color should not exceed 50 characters",
    }),
});

export function CreatePlayerForm({ teams }: { teams: Team[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createPlayerFormSchema>>({
    resolver: zodResolver(createPlayerFormSchema),
    defaultValues: {
      playerName: "",
      teamName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createPlayerFormSchema>) {
    try {
      // get team id from team name
      const teamId = teams.find(
        (team) => team.team_name === values.teamName
      )?.id;
      if (teamId === undefined) {
        alert("Failed to create player");
        return;
      }
      await createPlayer(values.playerName, teamId);
      form.reset();
      setOpen(false);
    } catch (error) {
      alert("Failed to create player");
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Player</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Create Your Player</DrawerTitle>
          <DrawerDescription className="text-center">
            Fill up the form here. Click save when you are done.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-1/2 md:mx-auto mx-3"
          >
            <FormField
              control={form.control}
              name="playerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your player name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team name for your player" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.team_name}>
                            <Label>{team.team_name}</Label>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button type="submit" className="w-1/2 sm:w-auto">
                Create Player
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-1/2 sm:w-auto">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </form>
        </Form>
        <DrawerFooter className="pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
