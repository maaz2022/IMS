import { DeleteInventory, DeleteTrackOrder } from "@/actions/user"; // Ensure you have a function for deleting inventory
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "./ui/use-toast";

interface InventoryDeleteProps {
  data: {
    id: string; // or number, depending on your implementation
    itemName: string; // Assuming you want to show the item name in the dialog
  };
}

export function TrackOrderDelete({ data }: InventoryDeleteProps) {
  const handleDelete = async () => {
    const response = await DeleteTrackOrder(data?.id);
    if (response?.error) {
      toast({ title: response.error });
    } else {
      toast({ title: "Inventory item deleted successfully!" });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-500">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this item?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this item will remove it from your inventory.
            <br />
            Item Name: <strong>{data?.itemName}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
