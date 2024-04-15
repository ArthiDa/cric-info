import { Button } from "@/components/ui/button";
import React, { use } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function page({ params }: { params: { id: string } }) {
  const matchId = params.id;
  return (
    <div className="mx-2 pt-5 divide-y-2 flex flex-col gap-4 my-2">
      <div>
        <h3 className="text-center text-xl font-bold">TeamA</h3>
        <p className="text-center font-medium">First Innings</p>
        <div className="flex justify-center items-center">
          <p className="text-6xl font-bold">0</p>
          <p className="text-6xl font-bold">-</p>
          <p className="text-6xl font-bold">0</p>
        </div>
      </div>
      <div className="pt-2">
        <div className="flex gap-6 justify-center items-center mb-2">
          <p>
            Extras - <span>0</span>
          </p>
          <p>
            Overs - <span>0</span>
          </p>
          <p>
            CRR - <span>0.00</span>
          </p>
        </div>
        <div className="flex gap-6 justify-center items-center mb-2">
          <p>
            Extras - <span>0</span>
          </p>
          <p>
            Overs - <span>0</span>
          </p>
          <p>
            CRR - <span>0.00</span>
          </p>
        </div>
      </div>
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Batsman</TableHead>
              <TableHead>R</TableHead>
              <TableHead>B</TableHead>
              <TableHead>4s</TableHead>
              <TableHead>6s</TableHead>
              <TableHead>SR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Arthi</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Arthi</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Bowler</TableHead>
              <TableHead>O</TableHead>
              <TableHead>M</TableHead>
              <TableHead>R</TableHead>
              <TableHead>W</TableHead>
              <TableHead>Eco</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Arthi</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>100</TableCell>
              <TableCell>250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="pt-2 flex justify-between">
        <div>
          <p></p>
        </div>
        <div className="flex justify-end">
          <Button variant={"outline"}>Over</Button>
        </div>
      </div>

      <div className="pt-2">
        <div className="grid grid-cols-6 gap-5">
          <div>
            <Button variant={"outline"}>1</Button>
          </div>
          <div>
            <Button variant={"outline"}>2</Button>
          </div>
          <div>
            <Button variant={"outline"}>3</Button>
          </div>
          <div>
            <Button variant={"outline"}>4</Button>
          </div>
          <div>
            <Button variant={"outline"}>5</Button>
          </div>
          <div>
            <Button variant={"outline"}>6</Button>
          </div>
        </div>
        <div className="grid grid-cols-5 pt-2">
          <div>
            <Button variant={"outline"}>6+</Button>
          </div>
          <div>
            <Button variant={"outline"}>Ext</Button>
          </div>
          <div>
            <Button variant={"outline"}>Dot</Button>
          </div>
          <div>
            <Button variant={"outline"}>Out</Button>
          </div>
          <div>
            <Button variant={"outline"}>Undo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
