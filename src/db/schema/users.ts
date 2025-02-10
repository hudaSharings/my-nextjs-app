import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { auditSchema } from "./audit";

export const tableName = 'users';

export const tableDefinition = {
  userName: text('userName'),
  name:text('name'),
  email:text('email'),
  mobileNumber:text('mobileNumber'),
  password:text('password'),
  userType:text('userType'),
  employeeId:integer('employeeId')
};

export const user = pgTable(tableName,{
    ...tableDefinition ,
    ...auditSchema
});

export default user