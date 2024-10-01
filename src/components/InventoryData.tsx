import React from "react";
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
import FormInput from "./FormInput";
import { addUpdateInventory } from "@/actions/user";
import { toast } from "./ui/use-toast";

type Props = {
  title: string;
  data: any; // Define this according to the expected data structure
};

const InventoryData = ({ title, data }: Props) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Convert the image file to Base64 if uploaded
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
      formData.set("imageBase64", imageBase64);
    }

    const response: any = await addUpdateInventory(formData, data);

    if (response?.error) {
      toast({ title: response?.error });
    } else {
      toast({ title: "Inventory updated successfully!" });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{title}</Button>
      </SheetTrigger>
      <SheetContent className="w-full space-y-8"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Update your inventory details below. Fill out all fields and click &quotSave&quot to submit.
          </SheetDescription>
        </SheetHeader>
        <div className="w-full max-w-7xl border border-gray-200 rounded-lg p-6 bg-white shadow-md">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="col-span- space-y-4">
              <FormInput
                type="text"
                name="name"
                label="Inventory Name"
                placeholder="Enter inventory name"
                defaultValue={data?.name}
              />
              <FormInput
                type="text"
                name="description"
                label="Description"
                placeholder="Enter inventory description"
                defaultValue={data?.description}
              />
              <FormInput
                type="number"
                name="cost"
                label="Cost"
                placeholder="Enter inventory cost"
                defaultValue={data?.cost}
              />
              <FormInput
                type="number"
                name="asPerPlan"
                label="As Per Plan"
                placeholder="Enter plan value"
                defaultValue={data?.asPerPlan}
              />
            </div>

            {/* Right Column */}
            <div className="col-span-1 space-y-4">
              <FormInput
                type="number"
                name="existing"
                label="Existing"
                placeholder="Enter existing inventory"
                defaultValue={data?.existing}
              />
              <FormInput
                type="number"
                name="required"
                label="Required"
                placeholder="Enter required quantity"
                defaultValue={data?.required}
              />
              <FormInput
                type="number"
                name="proInStore"
                label="Pro/In Store"
                placeholder="Enter Pro/In Store value"
                defaultValue={data?.proInStore}
              />
              {/* Image Upload Field */}
              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="mt-2"
                />
              </div>
            </div>

            <SheetFooter className="col-span-2 flex justify-end pt-6">
              <Button type="submit" className="mt-5">
                Save Changes
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

export default InventoryData;
