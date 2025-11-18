CREATE TABLE `amenities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`icon` varchar(100),
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `amenities_id` PRIMARY KEY(`id`),
	CONSTRAINT `amenities_nameKey_unique` UNIQUE(`nameKey`)
);
--> statement-breakpoint
CREATE TABLE `audit_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('user','cotista','reservation','document','voucher','dispute') NOT NULL,
	`entityId` int NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`notes` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`cityId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_cities_businessId_cityId_unique` UNIQUE(`businessId`,`cityId`)
);
--> statement-breakpoint
CREATE TABLE `business_developments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessId` int NOT NULL,
	`developmentId` int NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_developments_id` PRIMARY KEY(`id`),
	CONSTRAINT `business_developments_businessId_developmentId_unique` UNIQUE(`businessId`,`developmentId`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stateId` int NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`latitude` decimal(10,7) NOT NULL,
	`longitude` decimal(10,7) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cotista_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cotistaId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`pricePerNight` int NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT false,
	`isBooked` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cotista_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cotistas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`developmentId` int NOT NULL,
	`personalData` text,
	`ownershipProof` text,
	`bankDetails` text,
	`addressProof` text,
	`identityDocuments` text,
	`termsAccepted` boolean NOT NULL DEFAULT false,
	`termsAcceptedAt` timestamp,
	`status` enum('registered','under_review','approved','rejected','suspended') NOT NULL DEFAULT 'registered',
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cotistas_id` PRIMARY KEY(`id`),
	CONSTRAINT `cotistas_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(3) NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `development_amenities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`developmentId` int NOT NULL,
	`amenityId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `development_amenities_id` PRIMARY KEY(`id`),
	CONSTRAINT `development_amenities_developmentId_amenityId_unique` UNIQUE(`developmentId`,`amenityId`)
);
--> statement-breakpoint
CREATE TABLE `development_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`developmentId` int NOT NULL,
	`url` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `development_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `developments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cityId` int NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`descriptionKey` varchar(255) NOT NULL,
	`shortDescriptionKey` varchar(255) NOT NULL,
	`address` text,
	`latitude` decimal(10,7) NOT NULL,
	`longitude` decimal(10,7) NOT NULL,
	`rating` decimal(3,2) DEFAULT '0',
	`startingPrice` int NOT NULL,
	`rulesKey` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `developments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disputes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`reportedBy` int NOT NULL,
	`reportedAgainst` int,
	`reason` text NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','under_review','resolved','closed','escalated') NOT NULL DEFAULT 'open',
	`resolution` text,
	`resolvedBy` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`customerId` int NOT NULL,
	`documentType` enum('id','address_proof','other') NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`status` enum('pending','under_review','approved','rejected') NOT NULL DEFAULT 'pending',
	`rejectionReason` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fraud_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reservationId` int,
	`flagType` varchar(100) NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`description` text,
	`status` enum('open','investigating','resolved','false_positive') NOT NULL DEFAULT 'open',
	`resolvedBy` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fraud_flags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`customerId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`paymentMethod` varchar(100),
	`externalPaymentId` varchar(255),
	`status` enum('pending','processing','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`developmentId` int NOT NULL,
	`cotistaId` int NOT NULL,
	`availabilityId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`totalPrice` int NOT NULL,
	`status` enum('created','awaiting_payment','payment_pending','paid','documents_pending','documents_under_review','documents_rejected','approved','voucher_pending','voucher_sent','voucher_under_review','voucher_rejected','voucher_delivered','completed','refunded','cancelled','in_dispute') NOT NULL DEFAULT 'created',
	`paymentIntentId` varchar(255),
	`cancellationReason` text,
	`refundAmount` int,
	`refundedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsored_businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`descriptionKey` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`photoUrl` text,
	`photoFileKey` varchar(500),
	`websiteUrl` text,
	`phoneNumber` varchar(50),
	`address` text,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sponsored_businesses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryId` int NOT NULL,
	`code` varchar(10) NOT NULL,
	`nameKey` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`language` enum('pt','en','es','fr','it','ja') NOT NULL,
	`value` text NOT NULL,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `translations_key_language_unique` UNIQUE(`key`,`language`)
);
--> statement-breakpoint
CREATE TABLE `vouchers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`cotistaId` int NOT NULL,
	`fileUrl` text,
	`fileKey` varchar(500),
	`notes` text,
	`status` enum('pending','sent','under_review','approved','rejected','delivered') NOT NULL DEFAULT 'pending',
	`rejectionReason` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`deliveredAt` timestamp,
	`deadline` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vouchers_id` PRIMARY KEY(`id`),
	CONSTRAINT `vouchers_reservationId_unique` UNIQUE(`reservationId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','cotista') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('registered','verified','under_review','rejected','suspended') DEFAULT 'registered' NOT NULL;--> statement-breakpoint
CREATE INDEX `entity_idx` ON `audit_notes` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `admin_idx` ON `audit_notes` (`adminId`);--> statement-breakpoint
CREATE INDEX `business_idx` ON `business_cities` (`businessId`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `business_cities` (`cityId`);--> statement-breakpoint
CREATE INDEX `business_idx` ON `business_developments` (`businessId`);--> statement-breakpoint
CREATE INDEX `dev_idx` ON `business_developments` (`developmentId`);--> statement-breakpoint
CREATE INDEX `state_idx` ON `cities` (`stateId`);--> statement-breakpoint
CREATE INDEX `coord_idx` ON `cities` (`latitude`,`longitude`);--> statement-breakpoint
CREATE INDEX `cotista_idx` ON `cotista_availability` (`cotistaId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `cotista_availability` (`startDate`,`endDate`);--> statement-breakpoint
CREATE INDEX `published_idx` ON `cotista_availability` (`isPublished`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `cotistas` (`userId`);--> statement-breakpoint
CREATE INDEX `dev_idx` ON `cotistas` (`developmentId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `cotistas` (`status`);--> statement-breakpoint
CREATE INDEX `dev_idx` ON `development_amenities` (`developmentId`);--> statement-breakpoint
CREATE INDEX `amenity_idx` ON `development_amenities` (`amenityId`);--> statement-breakpoint
CREATE INDEX `dev_idx` ON `development_photos` (`developmentId`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `developments` (`cityId`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `developments` (`isActive`);--> statement-breakpoint
CREATE INDEX `reservation_idx` ON `disputes` (`reservationId`);--> statement-breakpoint
CREATE INDEX `reported_by_idx` ON `disputes` (`reportedBy`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `disputes` (`status`);--> statement-breakpoint
CREATE INDEX `reservation_idx` ON `documents` (`reservationId`);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `documents` (`customerId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `documents` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `fraud_flags` (`userId`);--> statement-breakpoint
CREATE INDEX `reservation_idx` ON `fraud_flags` (`reservationId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `fraud_flags` (`status`);--> statement-breakpoint
CREATE INDEX `severity_idx` ON `fraud_flags` (`severity`);--> statement-breakpoint
CREATE INDEX `reservation_idx` ON `payments` (`reservationId`);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `payments` (`customerId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `reservations` (`customerId`);--> statement-breakpoint
CREATE INDEX `dev_idx` ON `reservations` (`developmentId`);--> statement-breakpoint
CREATE INDEX `cotista_idx` ON `reservations` (`cotistaId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `reservations` (`status`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `reservations` (`startDate`,`endDate`);--> statement-breakpoint
CREATE INDEX `country_idx` ON `states` (`countryId`);--> statement-breakpoint
CREATE INDEX `key_idx` ON `translations` (`key`);--> statement-breakpoint
CREATE INDEX `reservation_idx` ON `vouchers` (`reservationId`);--> statement-breakpoint
CREATE INDEX `cotista_idx` ON `vouchers` (`cotistaId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `vouchers` (`status`);