import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { auditSchema } from './audit';

export const tableName = 'shifts';

export const tableDefinition = {
	clientId: integer('clientId'),
	name: text('name'),
	fromTime: text('fromTime'),
	toTime: text('toTime'),
	tolerance: text('tolerance'),
	expectedHours: text('expectedHours'),
	isSplit: boolean('isSplit'),
	isActive: boolean('isActive'),
};

export const shift = pgTable(tableName, {
	...tableDefinition,
	...auditSchema,
});

export default shift