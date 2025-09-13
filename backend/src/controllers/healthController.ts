import { Request, Response } from 'express';
import { dataService } from '../dataService';

export class HealthController {
  /**
   * GET /api/health - Health check endpoint
   */
  static async getHealth(req: Request, res: Response): Promise<void> {
    const stats = dataService.getStats();
    res.json({ 
      status: 'OK', 
      message: 'Flagged Posts API is running',
      timestamp: new Date().toISOString(),
      database: {
        totalPosts: stats.totalPosts
      }
    });
  }
}
