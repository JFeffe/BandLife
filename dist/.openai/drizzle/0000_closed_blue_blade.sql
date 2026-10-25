CREATE TABLE `coop_rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`revision` integer NOT NULL,
	`payload` text NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coop_rooms_creator_unique` ON `coop_rooms` (`creator`);