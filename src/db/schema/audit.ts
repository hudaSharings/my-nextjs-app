import { sql } from 'drizzle-orm';
import { serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const auditSchema = {
  id:serial('id').primaryKey(),
  createdOn:timestamp('createdOn').default(sql`now()`),
  createdBy:text('createdBy'),
  updatedOn:date('updatedOn').$onUpdate(()=>sql`now()`),
  updatedBy:text('updatedby'),
  orgId:text('orgId')
};