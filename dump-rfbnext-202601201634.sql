-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: rusfurbal.ru    Database: rfbnext
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` datetime NOT NULL COMMENT 'Дата и время события',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (4,'Запуск спонсоров мероприятия','2026-07-19 11:30:00','ожидает'),(5,'Запуск VIP(plus)-участников','2026-07-19 12:00:00','ожидает'),(6,'Запуск VIP-участников','2026-07-19 12:30:00','ожидает'),(7,'Открытие РФБ-4','2026-07-19 13:30:00','ожидает'),(8,'Запуск Основных участников','2026-07-19 13:00:00','ожидает'),(9,'Лицо РФБ','2026-07-19 13:35:00','ожидает'),(10,'Что это за зверь?','2026-07-19 13:40:00','ожидает'),(12,'Дефиле','2026-07-19 14:00:00','ожидает'),(13,'Перерыв','2026-07-19 14:30:00','ожидает'),(14,'Полоса препятствий','2026-07-19 14:40:00','ожидает'),(15,'Творческий Конкурс','2026-07-19 15:10:00','ожидает'),(16,'Реклама','2026-07-19 15:30:00','ожидает'),(17,'Итоги мероприятий','2026-07-19 15:35:00','ожидает'),(18,'Общее фото','2026-07-19 15:40:00','ожидает'),(19,'Мастер класс \"Создание сьюта, ошибки\"','2026-07-19 16:00:00','ожидает'),(20,'Угадай где','2026-07-19 16:15:00','ожидает'),(21,'Аукцион','2026-07-19 16:30:00','ожидает'),(22,'Дискотека','2026-07-19 17:00:00','ожидает'),(23,'Закрытие РФБ','2026-07-19 17:15:00','ожидает');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tikets`
--

DROP TABLE IF EXISTS `tikets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tikets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Участник, Вип, Вип+, Спонсор',
  `price` int DEFAULT NULL COMMENT '600, 1000, 2000, 8000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tikets`
--

LOCK TABLES `tikets` WRITE;
/*!40000 ALTER TABLE `tikets` DISABLE KEYS */;
INSERT INTO `tikets` VALUES (1,'Участник',600),(2,'Вип',1000),(3,'Вип+',2000),(4,'Спонсор',8000);
/*!40000 ALTER TABLE `tikets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sity` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Город участника',
  `screen_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Отображаемое имя пользователя',
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Номер участника ака его логин',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'хэшированный пароль участника',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Участник, Вип, Вип+, Спонсор, Контролёр, Админка, Организатор',
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `availability` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Статус прибытия true, false',
  `defile` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Участник дефиле (true, false)',
  `merch` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Выдан ли мерч (true, false)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `idx_phone` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Москва','Администратор','+79999999999','$2a$10$TqObF2PiHJP5BAShYZrnxOOHEst3UryRK5IavcmN6wWYH9/UfLzfK','Админка',NULL,NULL,0,0,0,'2025-11-29 22:39:42','2025-11-29 22:40:24'),(3,'Екатеринбург','Dipper Vaxerov','+79505474702','$2a$10$/ba/b5MzfoggAXqCU1IT9.g2.ggTe3OyryXUL13y3PuOuCzIy3N8O','Организатор','/api/avatars/0d2da7d0-60ae-4e6b-ba73-267f89b3681d.png','Двигаемся вперед и только вперед',0,0,0,'2025-12-02 15:22:27','2025-12-30 21:59:09'),(6,'Екатеринбург','Айзек','+79634386784','$2a$10$QK6EIZMYaAm6bCDOihK2W.ZBMUCsnDBkRqxxdzGTPvw/cwl4qep76','Контролёр','/api/avatars/1b5644a4-4729-48f1-a293-49fe7f37e223.png','',0,0,0,'2025-12-25 08:02:03','2025-12-30 14:23:17'),(14,'Екатеринбург','Kippi','+79122699789','$2a$10$HHCejyNU8flLme25SyEUvORb0XXwctkZ6xV7mNnnhBH7SB6mk6d2i','Участник','/api/avatars/742d4c76-553b-423a-9efa-c3f382906bcb.jpg',NULL,0,0,0,'2025-12-30 14:21:45','2026-01-01 19:55:40'),(15,'Курган','Гриня Псец','+79091499442','$2a$10$7FmPjRb1p4lpC/sy4oH3D.LsToaJoqCapXzgBUf2ZBpTTMlqrtc/S','Организатор','/api/avatars/11221d7d-9cc7-4e87-acca-ae804fcc6ca3.jpg','Ваш покорный ведущий',0,0,0,'2025-12-30 21:57:58','2025-12-30 22:06:13'),(16,'Курган','Чеф','+79658662777','$2a$10$2XQq37vHvDqLp/MoFstiXeu/aFMWyW/69EST9mCDjNXx2bFANWB4G','Организатор','/api/avatars/980bc4cd-c3c6-4c9e-9784-fb06d6c5a91e.jpg','В прямом эфире, только для вас',0,0,0,'2025-12-30 22:02:31','2025-12-30 22:08:51'),(17,'Екатеринбург','Kirai Neshemiron','+79226601317','$2a$10$I1QGE0r6Ym8cWkr1n4FIueFHohVPYKIF97Jbv4Fq1qsUuSb1mOWzS','Спонсор','/api/avatars/885557a7-d55f-487b-942e-ef0df10d0b16.jpg','Я пришел к вам, не с пустыми руками',0,0,0,'2025-12-30 22:39:07','2025-12-30 22:44:23'),(18,'Ирбит','Kodi Hellfin','+79923387402','$2a$10$dhvkmJZl5uFlKrbbehchDe/oVvOjVVKRE.jkvwTK39iF9vWyMB2xy','Участник','/api/avatars/afe02010-74a7-4657-b5e9-561c1ea73e56.jpg',NULL,0,1,0,'2026-01-01 19:57:50','2026-01-01 19:57:50'),(19,'Нижний Тагил','Nord Price','+79505626309','$2a$10$eU4rLEjSG4XK8MHbMFTNd.9KnHdFX0Hx8Sj/3ZDB93.YUujfA07pm','Волонтер','/api/avatars/3b9fd111-c863-4c08-8831-ecdc0b9b452a.jpg',NULL,0,0,0,'2026-01-01 20:08:32','2026-01-01 20:11:06'),(20,'Екатеринбург ','Кэлсон','+79030808613','$2a$10$BTDREqc69VI0d.BbUTtjh.ujKVN3HxCpu44VfVkB/lT.VXLg1.eoa','Участник','/api/avatars/a7d7f640-5694-4944-83a6-0ada757cca58.jpg',NULL,0,1,0,'2026-01-02 00:39:10','2026-01-02 00:39:10'),(21,'Екатеринбург','Lunar Wolf','+79088788824','$2a$10$NCk4r1dVrLAadHKbXjnwkezhnLKuAEat90dOB20QIOvXS1XMGRYGO','Волонтер','/api/avatars/c67740cb-cf20-4fe1-9a6b-aca24c0e3cf2.jpg',NULL,0,0,0,'2026-01-02 00:41:46','2026-01-17 10:49:07'),(22,'Реж','Белку - Емъ','+79025005866','$2a$10$NrZ4k/1AhRabl2loJXYsmufzMYTuWF3e3bIC4Tdd2nYydVxm7Kdqu','Волонтер','/api/avatars/fd3db1f4-a017-4941-91aa-c91586c3212c.jpg',NULL,0,0,0,'2026-01-04 15:54:32','2026-01-04 15:54:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'rfbnext'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-20 16:35:06
