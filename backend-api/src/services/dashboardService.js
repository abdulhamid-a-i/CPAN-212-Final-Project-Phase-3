import { Book } from "../models/Book.js";
import { Shipment } from "../models/Shipment.js";

export const dashboardService = {
  async getSummary() {
    const [books,shipments] = await Promise.all([
      Book.countDocuments(),
      Shipment.countDocuments(),

    ]);

    return {
      books,
      shipments
    };
  },
  async getBookSummary() {
    const [fiction,non_fiction] = await Promise.all([
      Book.countDocuments({genre: "fiction"}),
      Book.countDocuments({genre: "non_fiction"}),

    ]);

    return {
      fiction,
      non_fiction
    };
  },
  async getShipmentSummary() {
    const [ordered,arrived,processed] = await Promise.all([
      Shipment.countDocuments({status: "ORDERED"}),
      Shipment.countDocuments({status: "ARRIVED"}),
      Shipment.countDocuments({status: "PROCESSED"}),

    ]);

    return {
      ordered,
      arrived,
      processed
    };
  }


};