export type InventoryProps = {
  title: string;
  description: string;
  action: any;
  btnTitle: string;
  data?: any;
  add?: string;
  selectedId?: any;
};

export type deleteBtnProps = {
  title: string;
  handleDelete: any;
};

export type InventoryDataProps = {
  id: string;
  name: string;
  description: string;
  cost: number;
  lifeSpan: number;
  createdAt: Date;
  updatedAt: Date | null;
  asPerPlan: number;      
  existing: number;       
  required: number;       
  proInStore: number;     
  itemsShort: number;  
  image?: string;
}[];
interface Order {
  itemName: string;
  deliveredTo: string;
  status: string;
  destination: string; // New field added
  orderCost: number;   // New field added
    createdAt: Date;
  updatedAt: Date | null;
}
