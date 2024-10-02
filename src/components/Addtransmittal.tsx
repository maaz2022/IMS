'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { addUpdateTransmittal } from '@/actions/user';

// Define the structure for your form data
interface TransmittalDataProps {
  mall: string;
  storeCollectedFrom: string;
  storeDeliveredTo: string;
  managerName: string;
  descriptionOfGoods: string;
  quantity: string;
  dateDispatched: string;
  dateReceived: string;
  time: string;
  receivingStoreRepName: string;
  receivingStoreRepSignature: string;
}
type Props = {
  title: string;
  data: any; // Define this according to the expected data structure
};

const AddTransmittalForm = ({ title, data }: Props) => {
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response: any = await addUpdateTransmittal(formData, data);

    if (response?.error) {
      toast({ title: response?.error });
    } else {
      toast({ title: "Transmittal updated successfully!" });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{title}</Button>
      </SheetTrigger>
      <SheetContent className="w-full space-y-8">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Please fill in all fields to add a new transmittal.
          </SheetDescription>
        </SheetHeader>
        <div className="w-full max-w-7xl border border-gray-200 rounded-lg p-6 bg-white shadow-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="col-span-1 space-y-4">
              <div>
                <Label htmlFor="mall">Mall</Label>
                <Input
                  type="text"
                  name="mall"
                  defaultValue={data?.mall}
                  placeholder="Enter mall name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="storeCollectedFrom">Store Collected From</Label>
                <Input
                  type="text"
                  name="storeCollectedFrom"
                  defaultValue={data?.storeCollectedFrom}
               
                  placeholder="Enter store collected from"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="storeDeliveredTo">Store Delivered To</Label>
                <Input
                  type="text"
                  name="storeDeliveredTo"
              
                  defaultValue={data?.storeDeliveredTo}
                  placeholder="Enter store delivered to"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="managerName">Manager Name</Label>
                <Input
                  type="text"
                  name="managerName"
                 defaultValue={data?.managerName}
                  placeholder="Enter manager name"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-1 space-y-4">
              <div>
                <Label htmlFor="descriptionOfGoods">Description of Goods</Label>
                <Input
                  type="text"
                  name="descriptionOfGoods"
                 defaultValue={data?.descriptionOfGoods}
            
                  placeholder="Enter description of goods"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                defaultValue={data?.quantity}
               
                  placeholder="Enter quantity"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="dateDispatched">Date Dispatched</Label>
                <Input
                  type="date"
                  name="dateDispatched"
                  defaultValue={data?.dateDispatched}
              
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="dateReceived">Date Received</Label>
                <Input
                  type="date"
                  name="dateReceived"
                defaultValue={data?.dateReceived}
           
                  className="mt-2"
                />
              </div>
            </div>

            {/* Extra Fields */}
            <div className="col-span-1 space-y-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  name="time"
                  defaultValue={data?.time}
           
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="receivingStoreRepName">Receiving Store Rep Name</Label>
                <Input
                  type="text"
                  name="receivingStoreRepName"
                  defaultValue={data?.receivingStoreRepName}
          
                  placeholder="Enter representative name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="receivingStoreRepSignature">Receiving Store Rep Signature</Label>
                <Input
                  type="text"
                  name="receivingStoreRepSignature"
                  defaultValue={data?.receivingStoreRepSignature}
                  placeholder="Enter signature"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="col-span-2 flex justify-end pt-6">
              <Button type="submit" className="mt-5">
                Add Transmittal
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="ml-2 mt-5">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTransmittalForm;
