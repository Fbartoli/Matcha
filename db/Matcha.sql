CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY DEFAULT (UUID()),
  `username` varchar(255) UNIQUE,
  `name` varchar(255),
  `surname` varchar(255),
  `bio` varchar(255),
  `registration_date` date DEFAULT (now()),
  `email` varchar(255) UNIQUE,
  `birth_date` date,
  `created_at` timestamp,
  `gender_id` int,
  `password` varchar(255),
  `active` boolean DEFAULT (false),
  `password_reset` boolean DEFAULT (false),
  `location` json,
  `profil_complete` boolean DEFAULT (0),
  `confirmation` varchar(255),
  `notification` boolean DEFAULT (1),
  `score` int DEFAULT (0),
  `isOnline` boolean DEFAULT (0)
);

CREATE TABLE `gender` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_gender` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `gender_id` int
);

CREATE TABLE `relationship_types` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_relationship` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `relation_types_id` int
);

CREATE TABLE `photo` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `details` varchar(255),
  `link` varchar(255),
  `time_added` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `history_likes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `date` timestamp DEFAULT (now()),
  `user_id` varchar(255),
  `like_id` int
);

CREATE TABLE `like` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
);

CREATE TABLE `history_views` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `date` timestamp DEFAULT (now()),
  `user_id` varchar(255)
);

CREATE TABLE `views` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `history_views_id` int
);

CREATE TABLE `match` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `active` boolean DEFAULT (1)
);

CREATE TABLE `match_user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `match_id` int
);

CREATE TABLE `hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE
);

CREATE TABLE `interested_in_hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `hobbies_id` int
);

CREATE TABLE `conversation` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `time_started` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `participant` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `conversation_id` int,
  `user_id` varchar(255),
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

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `history_views` (`user_id`);

ALTER TABLE `views` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `views` ADD FOREIGN KEY (`history_views_id`) REFERENCES `history_views` (`id`);

ALTER TABLE `like` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `history_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
