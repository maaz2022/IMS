"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryDataProps } from "@/lib/interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateUser } from "@/actions/user";
import { toast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import InventoryData from "./InventoryData";
import InventoryUpdate from "./InventoryUpdate";
import Image from "next/image";
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
import { useState } from "react";

// Define your columns including new fields (asPerPlan, existing, required, proInStore, itemsShort)
export const columns: ColumnDef<InventoryDataProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "asPerPlan",
    header: "As Per Plan",
    cell: ({ row }) => row.getValue("asPerPlan"),
  },
  {
    accessorKey: "existing",
    header: "Existing",
    cell: ({ row }) => row.getValue("existing"),
  },
  {
    accessorKey: "required",
    header: "Required",
    cell: ({ row }) => row.getValue("required"),
  },
  {
    accessorKey: "proInStore",
    header: "Pro/In Store",
    cell: ({ row }) => row.getValue("proInStore"),
  },
  {
    id: "itemsShort",
    header: "Items Short",
    cell: ({ row }) => {
      const asPerPlan = Number(row.getValue("asPerPlan"));
      const proInStore = Number(row.getValue("proInStore"));
      const itemsShort =
        !isNaN(asPerPlan) && !isNaN(proInStore)
          ? asPerPlan - proInStore
          : "Invalid data";
      return itemsShort;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
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
    },
  },

  {
    accessorKey: "assignAction",
    header: "Transaction Status",
    cell: ({ row }) => {
      const task: any = row?.original;
      const client: any = task?.clients?.find(
        (cli: any) => cli.id == task?.userId
      );

      const handleChange = async (userId: string) => {
        const res: any = await updateUser(task?.id, userId, true);
        if (res?.error) {
          toast({ title: res?.error });
        } else {
          toast({ title: "Inventory successfully transferred" });
        }
      };
      return (
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={client ? client?.name : "Select a client"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a user</SelectLabel>
              {task?.clients?.map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  {item?.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <InventoryUpdate row={row} />,
  },
];

const DashboardDataTable = ({ data }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex justify-between w-full h-14 lg:h-16 items-center gap-4 border-b bg-gray-100/40  px-6">
        <div className="flex items-center gap-3 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search name..."
              value={
                (table?.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table?.getColumn("name")?.setFilterValue(event?.target?.value)
              }
              className="pl-8 max-w-sm outline-none focus:outline-none"
            />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button onClick={() => signOut()} type="submit">
          Sign Out
        </Button>
      </div>
      <div className="p-6">
        <div className="flex item justify-between pt-3 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventories Data
          </h1>
          <InventoryData title="Add Inventory" data={{}} />
        </div>
        <div>
          <div className="rounded-md border ">
            <Table>
              <TableHeader className="bg-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <div>
                              {header.column.getIsSorted() === "asc" && (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                              {header.column.getIsSorted() === "desc" && (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDataTable;
