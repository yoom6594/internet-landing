CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`carrier` enum('SK','LG') NOT NULL,
	`name` varchar(64) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`address` varchar(255) NOT NULL,
	`plan` varchar(64) NOT NULL,
	`installDate` varchar(32) NOT NULL,
	`status` enum('대기','연락완료','계약완료') NOT NULL DEFAULT '대기',
	`memo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
