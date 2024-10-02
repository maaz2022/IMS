import React from "react";
import DashboardDataTable from "@/components/DashboardDataTable"; // Assuming this is your data table component
import { db } from "@/lib/db";
import TransmittalForm from "@/components/TransmittalForm";

const Dashboard = async () => {
  // Fetch transmittals and associated clients in a transaction
  const [transmittalData, clients] = await db.$transaction([
    db.transmittal.findMany(), // Fetch all transmittals
    db.user.findMany(), // Fetch all users (clients)
  ]);

  // Log fetched data for debugging
  console.log("Transmittal Data:", transmittalData);
  console.log("Clients:", clients);

  // Map transmittal data to include relevant client information and format dates
  const response = transmittalData.map((transmittal) => ({
    ...transmittal,
    client: clients.find(client => client.id === transmittal.userId) || {}, // Find the matching client for each transmittal
    dateDispatched: new Date(transmittal.dateDispatched).toLocaleDateString(), // Format dateDispatched
    dateReceived: new Date(transmittal.dateReceived).toLocaleDateString(), // Format dateReceived
    // Add any other date fields that need formatting
  }));

  return <TransmittalForm data={response} />;
};

export default Dashboard;
