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
  data: any; // Consider defining a proper type for data
};

const InventoryData = ({ title, data }: Props) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.currentTarget); // Gather form inputs

    // Convert the image file to Base64 if it exists
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const imageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
      formData.set("imageBase64", imageBase64); // Add Base64 image to FormData
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Make changes to your inventory here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 max-h-screen overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mt-5">
              <div className="flex flex-col gap-5">
                <FormInput
                  type="text"
                  name="name"
                  label="Inventory Name"
                  placeholder="Enter the name"
                  defaultValue={data?.name}
                />
                <FormInput
                  type="text"
                  name="description"
                  label="Inventory Description"
                  defaultValue={data?.description}
                />
                <FormInput
                  type="number"
                  name="cost"
                  label="Inventory Cost"
                  defaultValue={data?.cost}
                />
                {/* New Fields */}
                <FormInput
                  type="number"
                  name="asPerPlan"
                  label="As Per Plan"
                  placeholder="Enter as per plan value"
                  defaultValue={data?.asPerPlan}
                />
                <FormInput
                  type="number"
                  name="existing"
                  label="Existing"
                  placeholder="Enter existing value"
                  defaultValue={data?.existing}
                />
                <FormInput
                  type="number"
                  name="required"
                  label="Required"
                  placeholder="Enter required value"
                  defaultValue={data?.required}
                />
                <FormInput
                  type="number"
                  name="proInStore"
                  label="Pro/In Store"
                  placeholder="Enter Pro/In Store value"
                  defaultValue={data?.proInStore}
                />
                {/* New Image Upload Field */}
                <div className="flex flex-col">
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    type="file"
                    id="image"
                    name="image" // Ensure this name matches what the server expects
                    accept="image/*" // Accept only image files
                  />
                </div>
              </div>
            </div>
            <SheetFooter className="flex justify-end">
              <Button type="submit" className="mt-5">
                {title}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="ml-2">
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
