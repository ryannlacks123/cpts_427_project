import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

/**
 * Get resource usage by event
 */
export const getResourceUsageByEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;

    const usageLogs = await prisma.resourceUsageLog.findMany({
      where: { eventId },
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Calculate totals per resource
    const summary = usageLogs.reduce((acc: any, log) => {
      const resourceId = log.resourceId;
      if (!acc[resourceId]) {
        acc[resourceId] = {
          resource: log.resource,
          totalCheckout: 0,
          totalReturn: 0,
          netUsage: 0,
          logs: [],
        };
      }
      
      if (log.change < 0) {
        acc[resourceId].totalCheckout += Math.abs(log.change);
      } else {
        acc[resourceId].totalReturn += log.change;
      }
      
      acc[resourceId].netUsage += log.change;
      acc[resourceId].logs.push(log);
      
      return acc;
    }, {});

    res.json({
      eventId,
      summary: Object.values(summary),
      totalLogs: usageLogs.length,
    });
  } catch (error) {
    console.error('Get resource usage by event error:', error);
    res.status(500).json({ error: 'Failed to fetch resource usage report' });
  }
};

/**
 * Get vendor-based resource usage
 */
export const getVendorResourceUsage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        vendor: true,
        usageLogs: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Group by vendor
    const vendorUsage = resources.reduce((acc: any, resource) => {
      const vendorId = resource.vendorId || 'no-vendor';
      const vendorName = resource.vendor?.name || 'No Vendor';

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName,
          resources: [],
          totalUsage: 0,
        };
      }

      const totalUsage = resource.usageLogs.reduce((sum, log) => sum + Math.abs(log.change), 0);
      
      acc[vendorId].resources.push({
        id: resource.id,
        name: resource.name,
        category: resource.category,
        totalQuantity: resource.totalQuantity,
        totalUsage,
        usageLogs: resource.usageLogs.length,
      });
      
      acc[vendorId].totalUsage += totalUsage;

      return acc;
    }, {});

    res.json(Object.values(vendorUsage));
  } catch (error) {
    console.error('Get vendor resource usage error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor resource usage report' });
  }
};

/**
 * Get inventory availability report
 */
export const getInventoryAvailability = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        vendor: true,
        eventResources: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDatetime: true,
                endDatetime: true,
              },
            },
          },
        },
      },
    });

    const inventory = resources.map(resource => {
      const totalAllocated = resource.eventResources.reduce(
        (sum, er) => sum + er.allocatedQuantity,
        0
      );
      const available = resource.totalQuantity - totalAllocated;
      const utilizationRate = resource.totalQuantity > 0
        ? ((totalAllocated / resource.totalQuantity) * 100).toFixed(2)
        : '0.00';

      return {
        id: resource.id,
        name: resource.name,
        category: resource.category,
        vendor: resource.vendor?.name || 'No Vendor',
        totalQuantity: resource.totalQuantity,
        allocated: totalAllocated,
        available,
        utilizationRate: parseFloat(utilizationRate),
        isLowStock: available < resource.totalQuantity * 0.2, // Less than 20% available
        allocatedToEvents: resource.eventResources.length,
      };
    });

    res.json({
      inventory,
      summary: {
        totalResources: resources.length,
        lowStock: inventory.filter(i => i.isLowStock).length,
        fullyAllocated: inventory.filter(i => i.available === 0).length,
      },
    });
  } catch (error) {
    console.error('Get inventory availability error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory availability report' });
  }
};

/**
 * Get usage over time report
 */
export const getUsageOverTime = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        whereClause.timestamp.lte = new Date(endDate as string);
      }
    }

    const usageLogs = await prisma.resourceUsageLog.findMany({
      where: whereClause,
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    // Group by date
    const dailyUsage = usageLogs.reduce((acc: any, log) => {
      const date = log.timestamp.toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          checkouts: 0,
          returns: 0,
          netChange: 0,
          uniqueResources: new Set(),
          uniqueEvents: new Set(),
        };
      }
      
      if (log.change < 0) {
        acc[date].checkouts += Math.abs(log.change);
      } else {
        acc[date].returns += log.change;
      }
      
      acc[date].netChange += log.change;
      acc[date].uniqueResources.add(log.resourceId);
      acc[date].uniqueEvents.add(log.eventId);
      
      return acc;
    }, {});

    // Convert to array and format
    const timeSeriesData = Object.values(dailyUsage).map((day: any) => ({
      date: day.date,
      checkouts: day.checkouts,
      returns: day.returns,
      netChange: day.netChange,
      uniqueResources: day.uniqueResources.size,
      uniqueEvents: day.uniqueEvents.size,
    }));

    res.json({
      timeRange: {
        start: startDate || 'beginning',
        end: endDate || 'now',
      },
      data: timeSeriesData,
      totalLogs: usageLogs.length,
    });
  } catch (error) {
    console.error('Get usage over time error:', error);
    res.status(500).json({ error: 'Failed to fetch usage over time report' });
  }
};

/**
 * Get low stock alerts
 */
export const getLowStockAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const threshold = parseFloat(req.query.threshold as string) || 0.2; // Default 20%

    const resources = await prisma.resource.findMany({
      include: {
        vendor: true,
        eventResources: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const lowStockItems = resources
      .map(resource => {
        const totalAllocated = resource.eventResources.reduce(
          (sum, er) => sum + er.allocatedQuantity,
          0
        );
        const available = resource.totalQuantity - totalAllocated;
        const availabilityRate = resource.totalQuantity > 0
          ? available / resource.totalQuantity
          : 0;

        return {
          resource,
          totalQuantity: resource.totalQuantity,
          allocated: totalAllocated,
          available,
          availabilityRate,
          vendor: resource.vendor?.name || 'No Vendor',
        };
      })
      .filter(item => item.availabilityRate < threshold)
      .sort((a, b) => a.availabilityRate - b.availabilityRate);

    res.json({
      threshold,
      alerts: lowStockItems.map(item => ({
        id: item.resource.id,
        name: item.resource.name,
        category: item.resource.category,
        vendor: item.vendor,
        totalQuantity: item.totalQuantity,
        available: item.available,
        allocated: item.allocated,
        availabilityRate: (item.availabilityRate * 100).toFixed(2) + '%',
        severity: item.availabilityRate === 0 ? 'critical' : 
                  item.availabilityRate < 0.1 ? 'high' : 'medium',
      })),
      total: lowStockItems.length,
    });
  } catch (error) {
    console.error('Get low stock alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
};
