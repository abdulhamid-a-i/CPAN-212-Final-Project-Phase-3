import { dashboardService } from "../services/dashboardService.js";
import { successResponse } from "../utils/apiResponse.js";

export const dashboardController = {
  async getSummary(req, res, next) {
    try {
      const data = await dashboardService.getSummary();
      return successResponse(res, data, "Dashboard summary loaded");
    } catch (error) {
      next(error);
    }
  },
  async getBooksSummary(req, res, next){
    try {
      const data = await dashboardService.getBookSummary();
      return successResponse(res, data, "Book Dashboard summary loaded");
    } catch (error) {
      next(error);
    }
  },
  async getShipmentsSummary(req, res, next){
    try {
      const data = await dashboardService.getShipmentSummary();
      return successResponse(res, data, "Shipment Dashboard summary loaded");
    } catch (error) {
      next(error);
    }
  }
};