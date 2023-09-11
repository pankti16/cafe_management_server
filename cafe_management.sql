-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 11, 2023 at 06:00 PM
-- Server version: 8.1.0
-- PHP Version: 7.4.3-4ubuntu2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `cafe`
--

CREATE TABLE `cafe` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cafe`
--

INSERT INTO `cafe` (`id`, `name`, `description`, `logo`, `location`, `status`) VALUES
('0a3a2740-3851-11ee-be75-448a5b2c2d83', 'OTC Cafe', 'OTC is a café & bar well tucked away from hectic city life. The cozy atmosphere makes it one of the best meeting places in Bugis for an intimate catch-up, a quick lunch meeting, or an enjoyable dinner before catching a performance.', NULL, 'Singapore', 1),
('0a3a3635-3851-11ee-be75-448a5b2c2d83', 'MiMi.c Cafe', 'A wonderful place for coffee and dessert.', NULL, 'Singapore', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cafe_employee`
--

CREATE TABLE `cafe_employee` (
  `id` int NOT NULL,
  `cafe_id` varchar(36) NOT NULL,
  `employee_id` varchar(9) NOT NULL,
  `joining_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cafe_employee`
--

INSERT INTO `cafe_employee` (`id`, `cafe_id`, `employee_id`, `joining_date`, `status`) VALUES
(1, '0a3a2740-3851-11ee-be75-448a5b2c2d83', 'UI0000001', '2023-08-11 14:53:40', 1),
(2, '0a3a3635-3851-11ee-be75-448a5b2c2d83', 'UI0000002', '2023-08-01 22:53:13', 1),
(3, '0a3a3635-3851-11ee-be75-448a5b2c2d83', 'UI0000003', '2023-07-07 22:53:50', 1),
(4, '0a3a2740-3851-11ee-be75-448a5b2c2d83', 'UI0000004', '2023-08-01 22:53:50', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` varchar(9) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `phone_number` int NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `email_address`, `phone_number`, `gender`, `status`) VALUES
('UI0000001', 'John Doe', 'john_doe@gmail.com', 899999999, 'male', 1),
('UI0000002', 'Mira Kapoor', 'mira.k@yahoo.com', 899999999, 'female', 1),
('UI0000003', 'Henry Potter', 'henryp@gmail.com', 877777777, 'male', 1),
('UI0000004', 'Palak Munshi', 'palakm@gmail.com', 877777777, 'female', 1),
('UI0000005', 'Jaykanth Shikre', 'jaykanth_shikre24@gmail.com', 988878888, 'male', 1),
('UI0000006', 'Jaya Bachan', 'jana.bachan45@gmail.com', 988868888, 'female', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cafe`
--
ALTER TABLE `cafe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `cafe_employee`
--
ALTER TABLE `cafe_employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_Employee` (`cafe_id`,`employee_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_address` (`email_address`),
  ADD UNIQUE KEY `uc_employee_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cafe_employee`
--
ALTER TABLE `cafe_employee`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cafe_employee`
--
ALTER TABLE `cafe_employee`
  ADD CONSTRAINT `cafe_employee_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafe` (`id`),
  ADD CONSTRAINT `cafe_employee_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
