export interface ShipmentBook {
  isbn: string;
  title: string;
  quantity: number;
};



export interface Shipment {
  _id: string;
  title: string;
  contents: ShipmentBook[];
  status: string;
  createdAt: string;
  updatedAt: string;
};