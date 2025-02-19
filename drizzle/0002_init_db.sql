CREATE TABLE "clients" (
	"name" text,
	"region" text,
	"country" text,
	"language" text,
	"isActive" boolean,
	"id" serial PRIMARY KEY NOT NULL,
	"createdOn" timestamp DEFAULT now(),
	"createdBy" text,
	"updatedOn" timestamp,
	"updatedby" text,
	"orgId" text
);
