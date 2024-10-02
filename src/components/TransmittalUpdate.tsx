import React from "react";
import AddTransmittalForm from "./Addtransmittal";
import { DeleteTransmittal } from "./DeleteTransmittal";

const TransmittalUpdate = ({ row }: any) => {
  const data = row.original;
  return (
    <div className="flex gap-5">
      <AddTransmittalForm title="Update" data={data} />
      <DeleteTransmittal data={data} />
    </div>
  );
};

export default TransmittalUpdate;
