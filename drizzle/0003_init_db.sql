CREATE TABLE "shifts" (
	"clientId" integer,
	"name" text,
	"fromTime" text,
	"toTime" text,
	"tolerance" text,
	"expectedHours" text,
	"isSplit" boolean,
	"isActive" boolean,
	"id" serial PRIMARY KEY NOT NULL,
	"createdOn" timestamp DEFAULT now(),
	"createdBy" text,
	"updatedOn" timestamp,
	"updatedby" text,
	"orgId" text
);
--> statement-breakpoint
CREATE TABLE "shiftSplits" (
	"shiftId" integer,
	"fromTime" text,
	"toTime" text,
	"expectedHours" text,
	"isActive" boolean,
	"id" serial PRIMARY KEY NOT NULL,
	"createdOn" timestamp DEFAULT now(),
	"createdBy" text,
	"updatedOn" timestamp,
	"updatedby" text,
	"orgId" text
);
