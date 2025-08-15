import { Group as PrismaGroup, GroupMembership as PrismaGroupMembership, Role } from '@prisma/client';

export interface Group extends PrismaGroup {
  memberships: GroupMembership[];
}

export interface GroupMembership extends PrismaGroupMembership {}

export { Role };
