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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CellInput } from 'jspdf-autotable'; 
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TransmittalUpdate row={row} />,
  },
];

const DashboardDataTable = ({ data }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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

  // Function to generate invoice
 const generateInvoice = () => {
  const doc = new jsPDF();
  
  // Set title and center it
  doc.setFontSize(22);
  doc.text("Transmittal Invoice", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  // Add date on the right-hand side
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${currentDate}`, doc.internal.pageSize.getWidth() - 50, 30);

  // Define table data from selected rows
  const selectedRows = table.getSelectedRowModel().rows;

  // Define table data
  const tableData: CellInput[][] = selectedRows.map((row) => [
    row.getValue("mall") as string,               // Ensure it's string
    row.getValue("storeCollectedFrom") as string, // Ensure it's string
    row.getValue("storeDeliveredTo") as string,   // Ensure it's string
    row.getValue("quantity") as number,           // Ensure it's a number
    row.getValue("dateDispatched") as string,     // Ensure it's a string
    row.getValue("descriptionOfGoods") as string, // Ensure it's a string
  ]);

  // Add the table with borders and custom styling
  autoTable(doc, {
    startY: 40,
    headStyles: {
      fillColor: [60, 141, 188], // Set header color
      textColor: [255, 255, 255], // White text in header
      fontSize: 12, // Header font size
      halign: 'center' // Center align the text in headers
    },
    bodyStyles: {
      fontSize: 10,
      halign: 'center', // Center align the table text
      cellPadding: 2, // Add padding for better readability
      lineColor: [44, 62, 80], // Border color for table
      lineWidth: 0.2 // Border thickness
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240] // Light gray for alternate rows
    },
    head: [
      ["Mall", "Collected From", "Delivered To", "Quantity", "Date Dispatched", "Description of Goods"],
    ],
    body: tableData, 
    margin: { top: 40 },
  });

  // Add a footer with company information or signature
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("Company Name: Pro Contracts.", 14, pageHeight - 20);
  doc.text("Address: 123 Main Street, City, Country", 14, pageHeight - 15);
  doc.text("Phone: +123456789", 14, pageHeight - 10);
  // doc.text(`Page ${doc.internal.getNumberOfPages()}`, doc.internal.pageSize.getWidth() - 20, pageHeight - 10); // Page number

  // Save the PDF
  doc.save("invoice.pdf");
};


  return (
    <div>
      <div className="flex justify-between w-full h-14 lg:h-16 items-center gap-4 border-b bg-gray-100/40  px-6">
        <div className="flex items-center gap-3 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by mall name..."
              value={
                (table?.getColumn("mall")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table?.getColumn("mall")?.setFilterValue(event?.target?.value)
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
        <div className="flex items-center gap-4">
          <Button onClick={generateInvoice} type="button">
            Generate Invoice
          </Button>
          <Button onClick={() => signOut()} type="submit">
            Sign Out
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex item justify-between pt-3 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Transmittal Data
          </h1>
          <AddTransmittalForm title="Add Transmittal" data={{}} />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                <SelectLabel>Rows Per Page</SelectLabel>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex-1 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardDataTable;
