DROP DATABASE IF EXISTS matcha;

CREATE DATABASE matcha;

use matcha;

CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY DEFAULT (UUID()),
  `username` varchar(255) UNIQUE,
  `name` varchar(255),
  `surname` varchar(255),
  `bio` varchar(255),
  `registration_date` date DEFAULT (now()),
  `email` varchar(255) UNIQUE,
  `birth_date` date,
  `age` int(2),
  `gender_id` int,
  `password` varchar(255),
  `active` boolean DEFAULT (false),
  `password_reset` boolean DEFAULT (false),
  `location` json,
  `last_connection` timestamp DEFAULT (now()),
  `profile_complete` boolean DEFAULT (0),
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
  `gender_id` int DEFAULT (1)
);

CREATE TABLE `photo` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `link` varchar(255),
  `position` int(1) NOT NULL,
  `time_added` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `history_likes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255)
);

CREATE TABLE `likes` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `history_likes_id` int,
  `date` timestamp DEFAULT (now()),
  `user_id` varchar(255)
);

CREATE TABLE `history_blocks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255)
);

CREATE TABLE `blocks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `history_blocks_id` int,
  `date` timestamp DEFAULT (now()),
  `user_id` varchar(255)
);

CREATE TABLE `history_reports` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255)
);

CREATE TABLE `reports` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `history_reports_id` int,
  `date` timestamp DEFAULT (now()),
  `user_id` varchar(255)
);

CREATE TABLE `history_views` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255)
);

CREATE TABLE `views` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `history_views_id` int,
  `date` timestamp DEFAULT (now())
);

CREATE TABLE `match` (
  `id` varchar(255) PRIMARY KEY,
  `active` boolean DEFAULT (1)
);

CREATE TABLE `match_user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `match_id` varchar(255)
);

CREATE TABLE `interested_in_hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `hobbies_name` varchar(255)
);

CREATE TABLE `conversation` (
  `id` varchar(255) PRIMARY KEY,
  `time_started` timestamp DEFAULT (now()),
  `active` boolean DEFAULT (1)
);

CREATE TABLE `participants` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `conversation_id` varchar(255),
  `user_id` varchar(255)
);

CREATE TABLE `messages` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `message_text` varchar(255),
  `conversation_id` varchar(255),
  `time` timestamp DEFAULT (now())
);

CREATE TABLE `notification` (
  `id` varchar(255) PRIMARY KEY,
  `username` varchar(255),
  `message` varchar(255),
  `read` boolean DEFAULT (0),
  `time` timestamp DEFAULT (now())
);

ALTER TABLE `history_views` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `views` ADD FOREIGN KEY (`history_views_id`) REFERENCES `history_views` (`id`) ON DELETE CASCADE;

ALTER TABLE `views` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `photo` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `users` ADD FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`) ON DELETE CASCADE;

ALTER TABLE `likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `likes` ADD FOREIGN KEY (`history_likes_id`) REFERENCES `history_likes` (`id`) ON DELETE CASCADE;

ALTER TABLE `interested_in_hobbies` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `interested_in_gender` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `interested_in_gender` ADD FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`) ON DELETE CASCADE;

ALTER TABLE `history_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `match_user` ADD FOREIGN KEY (`match_id`) REFERENCES `match` (`id`) ON DELETE CASCADE;

ALTER TABLE `match_user` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `history_reports` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `reports` ADD FOREIGN KEY (`history_reports_id`) REFERENCES `history_reports` (`id`) ON DELETE CASCADE;

ALTER TABLE `reports` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `blocks` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `history_blocks` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `blocks` ADD FOREIGN KEY (`history_blocks_id`) REFERENCES `history_blocks` (`id`) ON DELETE CASCADE;

ALTER TABLE `participants` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `participants` ADD FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`) ON DELETE CASCADE;

ALTER TABLE `messages` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `messages` ADD FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`) ON DELETE CASCADE;



INSERT INTO `gender` (`name`) VALUES ('bi'), ('male'), ('female');


-- SELECT history_likes.user_id as `user liked`, like.user_id as `user who likes`FROM `history_likes` INNER JOIN `like` ON history_likes.id = like.history_likes_id WHERE history_likes.user_id = '4a917b24-5408-11ea-b6b2-91623afb3c3a' AND like.user_id = '44608fa4-540a-11ea-b6b2-91623afb3c3a' OR history_likes.user_id = '44608fa4-540a-11ea-b6b2-91623afb3c3a' AND like.user_id = '4a917b24-5408-11ea-b6b2-91623afb3c3a';