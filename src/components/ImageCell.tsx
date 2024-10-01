import { useState } from 'react';
import Image from 'next/image'; // Adjust the import based on your setup
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from './ui/alert-dialog';
 // Import your AlertDialog components

// Create a separate component for the cell
export const ImageCell = ({ row }:any) => {
  const imageUrl = row.getValue("image") as string; // Cast to string
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger onClick={() => setIsOpen(true)}>
        <Image
          src={imageUrl || "/placeholder.png"} // Provide a placeholder if no image
          alt={row.getValue("name")} // Use the name as alt text for accessibility
          width={100}
          height={100}
          className="object-contain" // Adjust the size as needed
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full text-gray-600 hover:bg-gray-300 focus:outline-none"
          onClick={() => setIsOpen(false)} // Close the dialog
        >
          ✕ {/* Close Icon */}
        </button>
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl || "/placeholder.png"} // Provide a placeholder if no image
            alt={row.getValue("name")} // Use the name as alt text for accessibility
            className="object-contain rounded-lg" // Adjust the size as needed
            fill
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

