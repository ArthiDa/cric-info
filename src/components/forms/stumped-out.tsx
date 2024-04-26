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
import { useAtom } from "jotai";
import {
  outTypeDrawerOpenAtom,
  runOutDrawerOpenAtom,
  stumpedOutDrawerOpenAtom,
} from "@/lib/store";

export default function RunOut() {
  const [stumpedOutTypeDrawerOpen, setStumpedOutTypeDrawerOpen] = useAtom(
    stumpedOutDrawerOpenAtom
  );
  const [outTypeDrawerOpen, setOutTypeDrawerOpen] = useAtom(
    outTypeDrawerOpenAtom
  );
  const handleSubmit = () => {
    setStumpedOutTypeDrawerOpen(false);
    setOutTypeDrawerOpen(false);
  };
  return (
    <Drawer
      open={stumpedOutTypeDrawerOpen}
      onOpenChange={setStumpedOutTypeDrawerOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">Stumped</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">
            Select Stumped Out Type
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={handleSubmit} className="w-1/2 sm:w-auto">
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-1/2 sm:w-auto">
              Cancel
            </Button>
          </DrawerClose>
        </div>
        <DrawerFooter className="py-2" />
      </DrawerContent>
    </Drawer>
  );
}
