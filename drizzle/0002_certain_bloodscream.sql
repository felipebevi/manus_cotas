ALTER TABLE `cities` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `developments` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `developments` ADD CONSTRAINT `developments_slug_unique` UNIQUE(`slug`);