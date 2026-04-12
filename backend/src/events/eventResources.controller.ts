import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

/**
 * Get all resources allocated to an event
 */
export const getEventResources = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const eventResources = await prisma.eventResource.findMany({
      where: { eventId },
      include: {
        resource: {
          include: {
            vendor: true,
          },
        },
      },
    });

    res.json(eventResources);
  } catch (error) {
    console.error('Get event resources error:', error);
    res.status(500).json({ error: 'Failed to fetch event resources' });
  }
};

/**
 * Allocate a resource to an event
 */
export const allocateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { resourceId, allocatedQuantity } = req.body;

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Check if resource exists
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Check if sufficient quantity is available
    if (allocatedQuantity > resource.totalQuantity) {
      res.status(400).json({ 
        error: 'Insufficient quantity', 
        message: `Only ${resource.totalQuantity} units available` 
      });
      return;
    }

    // Check if already allocated
    const existingAllocation = await prisma.eventResource.findUnique({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
    });

    let eventResource;
    if (existingAllocation) {
      // Update existing allocation
      eventResource = await prisma.eventResource.update({
        where: {
          eventId_resourceId: {
            eventId,
            resourceId,
          },
        },
        data: {
          allocatedQuantity,
        },
        include: {
          resource: {
            include: {
              vendor: true,
            },
          },
        },
      });
    } else {
      // Create new allocation
      eventResource = await prisma.eventResource.create({
        data: {
          eventId,
          resourceId,
          allocatedQuantity,
        },
        include: {
          resource: {
            include: {
              vendor: true,
            },
          },
        },
      });
    }

    res.status(201).json(eventResource);
  } catch (error) {
    console.error('Allocate resource error:', error);
    res.status(500).json({ error: 'Failed to allocate resource' });
  }
};

/**
 * Update resource allocation for an event
 */
export const updateResourceAllocation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { eventId, resourceId } = req.params;
    const { allocatedQuantity } = req.body;

    // Check if resource exists
    const resource = await prisma.resource.findUnique({ 
      where: { id: resourceId } 
    });
    
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    // Check if sufficient quantity is available
    if (allocatedQuantity > resource.totalQuantity) {
      res.status(400).json({ 
        error: 'Insufficient quantity', 
        message: `Only ${resource.totalQuantity} units available` 
      });
      return;
    }

    const eventResource = await prisma.eventResource.update({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
      data: {
        allocatedQuantity,
      },
      include: {
        resource: {
          include: {
            vendor: true,
          },
        },
      },
    });

    res.json(eventResource);
  } catch (error) {
    console.error('Update resource allocation error:', error);
    res.status(500).json({ error: 'Failed to update resource allocation' });
  }
};

/**
 * Remove resource allocation from an event
 */
export const deallocateResource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, resourceId } = req.params;

    await prisma.eventResource.delete({
      where: {
        eventId_resourceId: {
          eventId,
          resourceId,
        },
      },
    });

    res.json({ message: 'Resource deallocated successfully' });
  } catch (error) {
    console.error('Deallocate resource error:', error);
    res.status(500).json({ error: 'Failed to deallocate resource' });
  }
};
