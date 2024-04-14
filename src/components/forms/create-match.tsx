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
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { team } from "@/lib/definitions";
import { createMatch } from "@/lib/actions/match.action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createMatchFormSchema = z.object({
  teamA: z
    .string()
    .min(2, {
      message: "Team name should be at least 2 characters long",
    })
    .max(50, {
      message: "Team name should not exceed 50 characters",
    }),
  teamB: z
    .string()
    .min(2, {
      message: "Team name should be at least 2 characters long",
    })
    .max(50, {
      message: "Team name should not exceed 50 characters",
    }),
  overs: z
    .string()
    .regex(/^\d+$/, { message: "Overs should be a positive integer" })
    .refine((value) => parseInt(value, 10) > 0, {
      message: "Overs should be greater than 0",
    }),
  wickets: z
    .string()
    .regex(/^\d+$/, { message: "Wickets should be a positive integer" })
    .refine((value) => parseInt(value, 10) > 0, {
      message: "Wickets should be greater than 0",
    })
    .refine((value) => parseInt(value, 10) <= 10, {
      message: "Wickets should not exceed 10",
    }),
});

export function CreateMatchForm({ teams }: { teams: team[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createMatchFormSchema>>({
    resolver: zodResolver(createMatchFormSchema),
    defaultValues: {
      teamA: "",
      teamB: "",
      overs: "1",
      wickets: "1",
    },
  });

  async function onSubmit(values: z.infer<typeof createMatchFormSchema>) {
    try {
      if (values.teamA === values.teamB) {
        alert("Team A and Team B should be different");
        return;
      }
      const teamIdA = teams.find((team) => team.teamName === values.teamA)?._id;
      const teamIdB = teams.find((team) => team.teamName === values.teamB)?._id;
      const res = await createMatch({
        teamIdA: teamIdA || "",
        teamIdB: teamIdB || "",
        overs: parseInt(values.overs, 10),
        wickets: parseInt(values.wickets, 10),
        toss: false,
      });
    } catch (e: any) {
      alert("Error in creating match");
      return;
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Match</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Create Your Match</DrawerTitle>
          <DrawerDescription className="text-center">
            Fill up the form here. Click save when you are done.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-1/2 md:mx-auto mx-3"
          >
            <div className="flex justify-evenly items-center">
              <FormField
                control={form.control}
                name="teamA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Team A</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Team A" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {teams.map((team) => (
                            <SelectItem
                              key={team.teamName}
                              value={team.teamName}
                            >
                              <Label>{team.teamName}</Label>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Team B</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Team B" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {teams.map((team) => (
                            <SelectItem
                              key={team.teamName}
                              value={team.teamName}
                            >
                              <Label>{team.teamName}</Label>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="overs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overs</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} defaultValue={"1"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wickets</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} defaultValue={"1"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button type="submit" className="w-1/2 sm:w-auto">
                Create Match
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
