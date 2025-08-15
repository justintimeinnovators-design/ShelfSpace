import { User as PrismaUser, UserStats as PrismaUserStats, Preferences as PrismaPreferences } from '@prisma/client';

export interface User extends PrismaUser {
  preferences?: Preferences;
  stats?: UserStats;
}

export interface UserStats extends PrismaUserStats {}

export interface Preferences extends PrismaPreferences {}
