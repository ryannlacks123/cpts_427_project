import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';

/**
 * Get all vendors
 */
export const getVendors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        resources: true,
      },
    });

    res.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};

/**
 * Get a single vendor by ID
 */
export const getVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        resources: true,
      },
    });

    if (!vendor) {
      res.status(404).json({ error: 'Vendor not found' });
      return;
    }

    res.json(vendor);
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
};

/**
 * Create a new vendor
 */
export const createVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, contactName, contactEmail, phone } = req.body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        contactName,
        contactEmail,
        phone,
      },
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
};

/**
 * Update a vendor
 */
export const updateVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, contactName, contactEmail, phone } = req.body;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(contactName && { contactName }),
        ...(contactEmail && { contactEmail }),
        ...(phone && { phone }),
      },
    });

    res.json(vendor);
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
};

/**
 * Delete a vendor
 */
export const deleteVendor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.vendor.delete({
      where: { id },
    });

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
};
