CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY DEFAULT (UUID()),
  `username` varchar(255) UNIQUE,
  `name` varchar(255),
  `surname` varchar(255),
  `bio` varchar(255),
  `registration_date` date DEFAULT (now()),
  `email` varchar(255) UNIQUE,
  `birth_date` date,
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

INSERT INTO `gender` (`name`) VALUES ('male'), ('female'), ('bi');

CREATE TABLE `interested_in_gender` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
  `gender_id` int DEFAULT (1)
);

CREATE TABLE `photo` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255),
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
  `user_id` varchar(255)
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

