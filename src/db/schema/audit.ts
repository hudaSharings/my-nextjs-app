import { sql } from 'drizzle-orm';
import { serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const auditSchema = {
  id:serial('id').primaryKey(),
  createdOn:timestamp('createdOn').default(sql`now()`),
  createdBy:text('createdBy'),
  updatedOn:timestamp('updatedOn'),
  updatedBy:text('updatedby'),
  orgId:text('orgId')
};