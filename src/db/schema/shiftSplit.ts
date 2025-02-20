import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { auditSchema } from "./audit";

export const tableName = 'shiftSplits';

export const tableDefinition = {
    shiftId: integer('shiftId'),
    fromTime:text('fromTime'),
    toTime:text('toTime'),
    expectedHours:text('expectedHours'),    
    isActive: boolean('isActive'),
}

export const shiftSplit = pgTable(tableName, {
    ...tableDefinition,
    ...auditSchema,
});

export default shiftSplit