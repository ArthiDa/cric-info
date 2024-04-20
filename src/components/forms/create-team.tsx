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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { createTeam } from "@/lib/actions";

const createTeamFormSchema = z.object({
  teamName: z
    .string()
    .min(2, {
      message: "Team name should be at least 2 characters long",
    })
    .max(50, {
      message: "Team name should not exceed 50 characters",
    }),
  teamColor: z
    .string()
    .min(3, {
      message: "Team name should be at least 3 characters long",
    })
    .max(20, {
      message: "Team name should not exceed 20 characters",
    }),
});

export function CreateTeamForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      teamName: "",
      teamColor: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createTeamFormSchema>) {
    try {
      await createTeam(values.teamName, values.teamColor);
      form.reset();
      setOpen(false);
    } catch (error) {
      alert("Failed to create team");
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Team</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Create Your Team</DrawerTitle>
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
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Team Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Team Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button type="submit" className="w-1/2 sm:w-auto">
                Create Team
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
