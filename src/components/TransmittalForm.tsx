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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { toast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
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
import { ImageCell } from "./ImageCell";
import { TransmittalDataProps } from "@/lib/interface";
import AddTransmittalForm from "./Addtransmittal";
import TransmittalUpdate from "./TransmittalUpdate";
import { updateUser } from "@/actions/user";


// Define your columns including new fields (asPerPlan, existing, required, proInStore, itemsShort)
export const columns: ColumnDef<TransmittalDataProps>[] = [
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
    accessorKey: "mall",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mall
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("mall")}</div>,
  },  
 {
    accessorKey: "storeCollectedFrom",
    header: "Store Collected From",
    cell: ({ row }) => <div>{row.getValue("storeCollectedFrom")}</div>,
  },
  {
    accessorKey: "storeDeliveredTo",
    header: "Store Delivered To",
    cell: ({ row }) => <div>{row.getValue("storeDeliveredTo")}</div>,
  },
  {
    accessorKey: "managerName",
    header: "Manager Name",
    cell: ({ row }) => <div>{row.getValue("managerName")}</div>,
  },
  {
    accessorKey: "descriptionOfGoods",
    header: "Description of Goods",
    cell: ({ row }) => <div>{row.getValue("descriptionOfGoods")}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "dateDispatched",
    header: "Date Dispatched",
    cell: ({ row }) => <div>{row.getValue("dateDispatched")}</div>,
  },
  {
    accessorKey: "dateReceived",
    header: "Date Received",
    cell: ({ row }) => <div>{row.getValue("dateReceived")}</div>,
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
  },
  {
    accessorKey: "receivingStoreRepName",
    header: "Receiving Store Rep Name",
    cell: ({ row }) => <div>{row.getValue("receivingStoreRepName")}</div>,
  },
  {
    accessorKey: "receivingStoreRepSignature",
    header: "Receiving Store Rep Signature",
    cell: ({ row }) => <div>{row.getValue("receivingStoreRepSignature")}</div>,
  },


  // {
  //   accessorKey: "assignAction",
  //   header: "Transaction Status",
  //   cell: ({ row }) => {
  //     const task: any = row?.original;
  //     const client: any = task?.clients?.find(
  //       (cli: any) => cli.id == task?.userId
  //     );

  //     const handleChange = async (userId: string) => {
  //       const res: any = await updateUser(task?.id, userId, true);
  //       if (res?.error) {
  //         toast({ title: res?.error });
  //       } else {
  //         toast({ title: "Transmittal successfully transferred" });
  //       }
  //     };
  //     return (
  //       <Select onValueChange={handleChange}>
  //         <SelectTrigger className="w-full">
  //           <SelectValue
  //             placeholder={client ? client?.name : "Select a client"}
  //           />
  //         </SelectTrigger>
  //         <SelectContent>
  //           <SelectGroup>
  //             <SelectLabel>Select a user</SelectLabel>
  //             {task?.clients?.map((item: any) => (
  //               <SelectItem key={item.id} value={item.id}>
  //                 {item?.name}
  //               </SelectItem>
  //             ))}
  //           </SelectGroup>
  //         </SelectContent>
  //       </Select>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TransmittalUpdate row={row} />,
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
            Transmittal Data
          </h1>
          <AddTransmittalForm title="Add Transmittal" data={{}} />
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
