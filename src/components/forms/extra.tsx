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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  BowlingScoresWithPlayer,
  InningsWithMatchNTeams,
} from "@/lib/definitions";
import { updateExtra } from "@/lib/actions";

const extraFormSchema = z.object({
  runs: z
    .string()
    .regex(/^\d+$/, { message: "Runs should be a number" })
    .refine((value) => parseInt(value, 10) > 0, {
      message: "Runs should be a positive number",
    }),
});

export default function Extra({
  inningDetails,
  bowler,
}: {
  inningDetails: InningsWithMatchNTeams;
  bowler: BowlingScoresWithPlayer | null;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof extraFormSchema>>({
    resolver: zodResolver(extraFormSchema),
    defaultValues: {
      runs: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof extraFormSchema>) => {
    try {
      if (!bowler) {
        throw new Error("Bowler not found");
      }
      await updateExtra(
        inningDetails,
        bowler.player_id,
        parseInt(values.runs, 10)
      );
      setOpen(false);
    } catch (error) {
      alert("Error in submitting extra runs");
    }
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Extra</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Extra Types</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-1/2 md:mx-auto mx-3"
          >
            <FormField
              control={form.control}
              name="runs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Run</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
