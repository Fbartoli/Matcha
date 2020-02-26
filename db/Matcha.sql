DROP DATABASE matcha;

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
  `age` int (2),
  `gender_id` int,
  `password` varchar(255),
  `active` boolean DEFAULT (false),
  `password_reset` boolean DEFAULT (false),
  `location` json,
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
  `date` timestamp DEFAULT(now()),
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
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `active` boolean DEFAULT (1)
);

CREATE TABLE `match_user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `match_id` int
);

CREATE TABLE `interested_in_hobbies` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `hobbies_name` varchar(255)
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
  `time_left` timestamp DEFAULT (now())
);

CREATE TABLE `message` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `participant_id` int,
  `message_text` varchar(255),
  `time` timestamp
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

INSERT INTO `gender` (`name`) VALUES ('male'), ('female'), ('bi');


-- SELECT history_likes.user_id as `user liked`, like.user_id as `user who likes`FROM `history_likes` INNER JOIN `like` ON history_likes.id = like.history_likes_id WHERE history_likes.user_id = '4a917b24-5408-11ea-b6b2-91623afb3c3a' AND like.user_id = '44608fa4-540a-11ea-b6b2-91623afb3c3a' OR history_likes.user_id = '44608fa4-540a-11ea-b6b2-91623afb3c3a' AND like.user_id = '4a917b24-5408-11ea-b6b2-91623afb3c3a';