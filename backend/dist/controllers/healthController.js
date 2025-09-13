"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const dataService_1 = require("../dataService");
class HealthController {
    /**
     * GET /api/health - Health check endpoint
     */
    static async getHealth(req, res) {
        const stats = dataService_1.dataService.getStats();
        res.json({
            status: 'OK',
            message: 'Flagged Posts API is running',
            timestamp: new Date().toISOString(),
            database: {
                totalPosts: stats.totalPosts,
                cacheSize: stats.cacheSize
            }
        });
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=healthController.js.map