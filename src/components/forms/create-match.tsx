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
import { match } from "assert";

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
  overs: z.number().int().positive({
    message: "Overs should be a positive number",
  }),
  wickets: z
    .number()
    .int()
    .min(0, {
      message: "Wickets should be a positive number",
    })
    .max(10, {
      message: "Wickets should not exceed 10",
    }),
});

const teams = [
  { teamName: "Bangladesh", teamColor: "Green" },
  { teamName: "India", teamColor: "Blue" },
  { teamName: "England", teamColor: "Red" },
];

export function CreateMatchForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createMatchFormSchema>>({
    resolver: zodResolver(createMatchFormSchema),
    defaultValues: {
      teamA: "",
      teamB: "",
      overs: 0,
      wickets: 0,
    },
  });

  function onSubmit(values: z.infer<typeof createMatchFormSchema>) {
    if (values.teamA === values.teamB) {
      alert("Team A and Team B should be different");
      return;
    }
    console.log(values);
    form.reset();
    setOpen(false);
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button type="submit" className="w-full sm:w-auto">
                Create Match
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
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
