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
import { z } from "zod";
import {
  BattingScoresWithPlayer,
  BowlingScoresWithPlayer,
  InningsWithMatchNTeams,
} from "@/lib/definitions";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { updateMoreScore } from "@/lib/actions";

const moreFormSchema = z.object({
  strikerName: z.string().min(2, { message: "Striker name is required" }),
  bowlerName: z.string(),
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
  isSix: z.string(),
  isFour: z.string(),
});

export default function More({
  inningDetails,
  bowler,
  strikers,
}: {
  inningDetails: InningsWithMatchNTeams;
  bowler: BowlingScoresWithPlayer | null;
  strikers: BattingScoresWithPlayer[];
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof moreFormSchema>>({
    resolver: zodResolver(moreFormSchema),
    defaultValues: {
      strikerName: "",
      bowlerName: bowler?.player_id ?? "",
      totalRuns: "0",
      extras: "0",
      ballCount: "true",
      isSix: "false",
      isFour: "false",
    },
  });
  const onSubmit = async (values: z.infer<typeof moreFormSchema>) => {
    if (values.bowlerName === "") {
      alert("Please refresh the page and try again with valid data.");
      return;
    }

    try {
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
      const isSix = values.isSix === "true";
      const isFour = values.isFour === "true";

      await updateMoreScore(
        inningDetails,
        strikerId,
        bowlerId,
        totalRuns,
        extras,
        batsmanRuns,
        isLegalDelivery,
        isFour,
        isSix
      );
      form.reset();
      setOpen(false);
    } catch (error) {
      alert("Error in submitting data");
      return;
    }
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">More</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Select Score Type</DrawerTitle>
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
              name="isSix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Six</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue="false"
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
              name="isFour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Four</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue="false"
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
