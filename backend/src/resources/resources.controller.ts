import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

/**
 * Get all resources
 */
export const getResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        vendor: true,
        eventResources: {
          include: {
            event: true,
          },
        },
      },
    });

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

/**
 * Get a single resource by ID
 */
export const getResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        vendor: true,
        eventResources: {
          include: {
            event: true,
          },
        },
        usageLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            event: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    res.json(resource);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

/**
 * Create a new resource
 */
export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, description, vendorId, totalQuantity } = req.body;

    const resource = await prisma.resource.create({
      data: {
        name,
        category,
        description,
        vendorId: vendorId || null,
        totalQuantity,
      },
      include: {
        vendor: true,
      },
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

/**
 * Update a resource
 */
export const updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, description, vendorId, totalQuantity } = req.body;

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description && { description }),
        ...(vendorId !== undefined && { vendorId: vendorId || null }),
        ...(totalQuantity !== undefined && { totalQuantity }),
      },
      include: {
        vendor: true,
      },
    });

    res.json(resource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

/**
 * Delete a resource
 */
export const deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.resource.delete({
      where: { id },
    });

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

/**
 * Get resource usage logs
 */
export const getResourceUsage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const usageLogs = await prisma.resourceUsageLog.findMany({
      where: { resourceId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        resource: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json(usageLogs);
  } catch (error) {
    console.error('Get resource usage error:', error);
    res.status(500).json({ error: 'Failed to fetch resource usage' });
  }
};

/**
 * Log resource usage (checkout/return)
 */
export const logResourceUsage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { eventId, change, notes } = req.body;

    // Verify resource exists
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Create usage log
    const usageLog = await prisma.resourceUsageLog.create({
      data: {
        resourceId: id,
        eventId,
        userId: req.user.userId,
        change,
        notes: notes || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(usageLog);
  } catch (error) {
    console.error('Log resource usage error:', error);
    res.status(500).json({ error: 'Failed to log resource usage' });
  }
};
