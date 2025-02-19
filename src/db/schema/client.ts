import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { auditSchema } from './audit';

export const tableName = 'clients';

export const tableDefinition = {
	name: text('name'),
	region:text('region'),
    country:text('country'),
    language:text('language'), 
	isActive: boolean('isActive'),
};

export const client = pgTable(tableName, {
	...tableDefinition,
	...auditSchema,
});

export default client