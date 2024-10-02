import { LayoutDashboard, MapPinIcon, Pen, User } from "lucide-react";

export const sidebar = [
  { title: "Inventory", link: "/dashboard", icon: <LayoutDashboard /> },
  { title: "Clients", link: "/dashboard/clients", icon: <User /> },
  { title: "Track Orders", link: "/dashboard/trackOrders", icon: <MapPinIcon /> },
  { title: "Transmittal Info", link: "/dashboard/transmittal", icon: <Pen /> },
];
