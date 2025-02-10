CREATE TABLE "users" (
	"userName" text,
	"name" text,
	"email" text,
	"mobileNumber" text,
	"password" text,
	"userType" text,
	"employeeId" integer,
	"id" serial PRIMARY KEY NOT NULL,
	"createdOn" timestamp DEFAULT now(),
	"createdBy" text,
	"updatedOn" date,
	"updatedby" text,
	"orgId" text
);
