"use client";
import React, { useState } from "react";
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
import { useAtom } from "jotai";
import { outTypeDrawerOpenAtom, runOutDrawerOpenAtom } from "@/lib/store";
import { z } from "zod";
import {
  BattingScoresWithPlayer,
  BowlingScoresWithPlayer,
  InningsWithMatchNTeams,
} from "@/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { updateRunOut } from "@/lib/actions";

const runOutFormSchema = z.object({
  strikerName: z.string().min(2, { message: "Striker name is required" }),
  bowlerName: z.string(),
  outBatsman: z.string(),
  totalRuns: z
    .string()
    .regex(/^\d+$/, { message: "totalRuns should be a number" })
    .refine((value) => parseInt(value, 10) >= 0, {
      message: "totalRuns should be a positive number or zero",
    }),
  extras: z
    .string()
    .regex(/^\d+$/, { message: "Extras should be a number" })
    .refine((value) => parseInt(value, 10) >= 0, {
      message: "Extras should be a positive number or zero",
    }),
  ballCount: z.string(),
});

export default function RunOut({
  inningDetails,
  striker,
  bowler,
  strikers,
}: {
  inningDetails: InningsWithMatchNTeams;
  striker: BattingScoresWithPlayer | null;
  bowler: BowlingScoresWithPlayer | null;
  strikers: BattingScoresWithPlayer[];
}) {
  const [runOutTypeDrawerOpen, setRunOutTypeDrawerOpen] =
    useAtom(runOutDrawerOpenAtom);
  const [outTypeDrawerOpen, setOutTypeDrawerOpen] = useAtom(
    outTypeDrawerOpenAtom
  );
  const form = useForm<z.infer<typeof runOutFormSchema>>({
    resolver: zodResolver(runOutFormSchema),
    defaultValues: {
      strikerName: "",
      bowlerName: bowler?.player_id ?? "",
      outBatsman: striker?.player_id ?? "",
      totalRuns: "0",
      extras: "0",
      ballCount: "true",
    },
  });
  const onSubmit = async (values: z.infer<typeof runOutFormSchema>) => {
    if (values.outBatsman === "" || values.bowlerName === "") {
      alert("Please refresh the page and try again with valid data.");
      return;
    }

    try {
      const outBatsmanId = values.outBatsman;
      const strikerId = strikers.find(
        (st) => st.player_name === values.strikerName
      )?.player_id;
      if (!strikerId) {
        throw new Error("Striker not found");
      }
      const extras = parseInt(values.extras, 10);
      const totalRuns = parseInt(values.totalRuns, 10);
      const batsmanRuns = totalRuns - extras;
      const bowlerId = values.bowlerName;
      const isLegalDelivery = values.ballCount === "true";

      await updateRunOut(
        outBatsmanId,
        inningDetails,
        strikerId,
        bowlerId,
        totalRuns,
        extras,
        batsmanRuns,
        isLegalDelivery
      );

      setRunOutTypeDrawerOpen(false);
      setOutTypeDrawerOpen(false);
    } catch (error) {
      alert("Error in selecting out type");
      return;
    }
  };
  return (
    <Drawer open={runOutTypeDrawerOpen} onOpenChange={setRunOutTypeDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Run Out</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Select Run Out Type</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-1/2 md:mx-auto mx-3"
          >
            <FormField
              control={form.control}
              name="strikerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select the batsman who faces the ball</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required={true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Striker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {strikers.map((st) => (
                          <SelectItem key={st.player_id} value={st.player_name}>
                            <Label>{st.player_name}</Label>
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
              name="ballCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Delivery</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue="true"
                      className="flex flex-cols justify-center items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem {...field} value="true" id="r1" />
                        <Label htmlFor="r1">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem {...field} value="false" id="r2" />
                        <Label htmlFor="r2">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extras"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Run</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} defaultValue={"0"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalRuns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Run with extra run included</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} defaultValue={"0"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button type="submit" className="w-1/2 sm:w-auto">
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-1/2 sm:w-auto">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </form>
        </Form>

        <DrawerFooter className="py-2" />
      </DrawerContent>
    </Drawer>
  );
}
