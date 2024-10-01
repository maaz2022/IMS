import React from "react";
import DashboardDataTable from "@/components/DashboardDataTable";
import { db } from "@/lib/db";

const Dashboard = async () => {
  const [inventoryData, clients] = await db.$transaction([
    db.inventory.findMany(),
    db.user.findMany(),
  ]);

  // Log fetched data for debugging
  console.log("Inventory Data:", {inventoryData});
  console.log("Clients:", {clients});

  // Assuming each inventory item has an image field, combine data correctly
  const response = inventoryData.map((inv) => ({
    ...inv,
    clients: clients.map(client => ({ id: client.id, name: client.name })), // Map clients correctly
  }));

  return <DashboardDataTable data={response} />;
};

export default Dashboard;
