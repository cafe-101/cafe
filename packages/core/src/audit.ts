import { PrismaClient, AuditAction } from '@cafe/db';

const prisma = new PrismaClient();

export interface AuditLogOptions {
  action: AuditAction;
  entityId?: string;
  entityType?: string;
  userId?: string;
  branchId?: string;
  ipAddress?: string;
  deviceInfo?: string;
  metadata?: any;
}

/**
 * Creates an audit log entry in the database.
 * 
 * @param options - The audit log details.
 * @returns The created audit log record.
 */
export async function createAuditLog(options: AuditLogOptions) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        action: options.action,
        entityId: options.entityId,
        entityType: options.entityType,
        userId: options.userId,
        branchId: options.branchId,
        ipAddress: options.ipAddress,
        deviceInfo: options.deviceInfo,
        metadata: options.metadata ? JSON.parse(JSON.stringify(options.metadata)) : undefined,
      },
    });
    return log;
  } catch (error) {
    // We log the error but don't throw it so that audit logging failure 
    // doesn't crash the main business process.
    console.error('[Audit Logger] Failed to create audit log:', error);
    return null;
  }
}
