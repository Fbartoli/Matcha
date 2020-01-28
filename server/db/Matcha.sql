DROP DATABASE IF EXISTS matcha;
CREATE DATABASE IF NOT EXISTS matcha;

USE matcha;

CREATE TABLE `users` (
  `id` binary(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
  `mobile` int(10) UNIQUE,
  `username` varchar(255) UNIQUE,
  `name` varchar(255),
  `surname` varchar(255),
  `bio` varchar(255),
  `registration_date` date DEFAULT (now()),
  `email` varchar(255) UNIQUE,
  `birth_date` date,
  `created_at` timestamp,
  `country` varchar(255),
  `city` varchar(255),
  `postal_code` int,
  `gender_id` int,
  `password` varchar(255),
  `active` boolean DEFAULT (false),
  `location` json,
  `confirmation` varchar(255),
  `notification` boolean DEFAULT (1),
  `score` int DEFAULT (0),
  `isOnline` boolean DEFAULT (0),
  `photo` json
);

CREATE TABLE `gender` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_gender` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `gender_id` int
);

CREATE TABLE `relationship_types` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_relationship` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `relation_types_id` int
);

CREATE TABLE `photo` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `details` varchar(255),
  `link` varchar(255),
  `time_added` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `match` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `active` boolean DEFAULT (1)
);

CREATE TABLE `match_user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `match_id` int
);

CREATE TABLE `hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `hobbies_id` int
);

CREATE TABLE `conversation` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` binary(16),
  `time_started` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `participant` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `conversation_id` int,
  `user_id` binary(16),
  `time_joined` timestamp DEFAULT (now()),
  `time_left` timestamp DEFAULT null
);

CREATE TABLE `message` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `participant_id` int,
  `message_text` varchar(255),
  `time` timestamp
);

ALTER TABLE `users` ADD FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`);

ALTER TABLE `interested_in_gender` ADD FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`);

ALTER TABLE `interested_in_gender` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `interested_in_relationship` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `interested_in_relationship` ADD FOREIGN KEY (`relation_types_id`) REFERENCES `relationship_types` (`id`);

ALTER TABLE `photo` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `match_user` ADD FOREIGN KEY (`match_id`) REFERENCES `match` (`id`);

ALTER TABLE `match_user` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `interested_in_hobbies` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `interested_in_hobbies` ADD FOREIGN KEY (`hobbies_id`) REFERENCES `hobbies` (`id`);

ALTER TABLE `conversation` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `participant` ADD FOREIGN KEY (`id`) REFERENCES `conversation` (`id`);

ALTER TABLE `participant` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `message` ADD FOREIGN KEY (`id`) REFERENCES `participant` (`id`);
