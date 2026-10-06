import { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService.js';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor(dashboardService: DashboardService = new DashboardService()) {
    this.dashboardService = dashboardService;
  }

  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard statistics',
      });
    }
  };
}
