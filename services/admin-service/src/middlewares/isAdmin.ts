
import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (user && user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
