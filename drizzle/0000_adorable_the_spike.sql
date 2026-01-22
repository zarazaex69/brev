CREATE TABLE `user_actions` (
	`id` integer PRIMARY KEY NOT NULL,
	`telegram_id` integer NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_tokens` (
	`id` integer PRIMARY KEY NOT NULL,
	`telegram_id` integer NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`telegram_id` integer NOT NULL,
	`username` text,
	`first_name` text,
	`last_name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_tokens_telegram_id_unique` ON `user_tokens` (`telegram_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_telegram_id_unique` ON `users` (`telegram_id`);