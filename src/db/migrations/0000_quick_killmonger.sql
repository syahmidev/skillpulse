CREATE TABLE `learning_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`skill_id` text NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`duration_minutes` integer NOT NULL,
	`difficulty` text,
	`mood` text,
	`log_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`skill_id` text NOT NULL,
	`title` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`current_level` text NOT NULL,
	`target_level` text NOT NULL,
	`status` text NOT NULL,
	`goal` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
