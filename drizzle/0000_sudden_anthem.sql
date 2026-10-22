CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`cohort` text NOT NULL,
	`session` integer NOT NULL,
	`due` text,
	`unlock` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assignment_cohort_session` ON `assignments` (`cohort`,`session`);--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`event` text NOT NULL,
	`target` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cohorts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`policy` text DEFAULT 'open' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content` (
	`session` integer PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`session` integer NOT NULL,
	`answers` text NOT NULL,
	`revision` integer NOT NULL,
	`updated` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `draft_owner_session` ON `drafts` (`owner`,`session`);--> statement-breakpoint
CREATE TABLE `extensions` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`session` integer NOT NULL,
	`due` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`message` text NOT NULL,
	`created` text NOT NULL,
	`seen` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notifications_owner` ON `notifications` (`owner`);--> statement-breakpoint
CREATE TABLE `roster` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`cohort` text NOT NULL,
	`studentId` text NOT NULL,
	`consent` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `roster_cohort` ON `roster` (`cohort`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`cohort` text NOT NULL,
	`session` integer NOT NULL,
	`answers` text NOT NULL,
	`created` text NOT NULL,
	`status` text NOT NULL,
	`late` integer NOT NULL,
	`revision` integer NOT NULL,
	`grade` text,
	`feedback` text,
	`reviewer` text
);
--> statement-breakpoint
CREATE INDEX `submission_cohort_status` ON `submissions` (`cohort`,`status`);--> statement-breakpoint
CREATE INDEX `submission_owner_session` ON `submissions` (`owner`,`session`);--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`session` integer NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `uploads_owner_session` ON `uploads` (`owner`,`session`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `versions` (
	`id` text PRIMARY KEY NOT NULL,
	`draft` text NOT NULL,
	`revision` integer NOT NULL,
	`answers` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `version_draft` ON `versions` (`draft`,`revision`);