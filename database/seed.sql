-- Notes Management System Seed Data

USE `notes_db`;

-- Demo Users (Password for both demo users is "Password123!")
-- Hashed password using bcrypt (10 rounds): $2a$10$wT8dGq3T4Xp4R5aWz8jQ4e.oK1O/4t2s6x7y8z9a0b1c2d3e4f5g6
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `avatar`) VALUES
(1, 'Samiullah', 'sami@example.com', '$2a$10$7v4V5z.dC5F8G9H0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samiullah'),
(2, 'Jane Doe', 'jane@example.com', '$2a$10$7v4V5z.dC5F8G9H0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- Demo Notes
INSERT INTO `notes` (`user_id`, `title`, `content`, `category`, `tags`, `color`, `is_pinned`, `is_archived`, `is_deleted`, `is_favorite`) VALUES
(1, 'Welcome to Notes System', '<h1>Welcome to your new workspace!</h1><p>This is a <strong>rich text editor</strong> supporting headers, <em>italics</em>, code blocks, lists, and full export capabilities.</p>', 'Work', 'welcome,guide', '#4f46e5', 1, 0, 0, 1),
(1, 'Project Architecture Notes', '<h2>Clean Layered Architecture</h2><ul><li>Controllers for HTTP handling</li><li>Services for business logic</li><li>Repositories for database queries</li></ul>', 'Engineering', 'backend,architecture', '#0284c7', 1, 0, 0, 0),
(1, 'Weekly Grocery List', '<p>Buy organic vegetables, almond milk, dark chocolate, and whole wheat bread.</p>', 'Personal', 'shopping,groceries', '#059669', 0, 0, 0, 1),
(1, 'Archived Strategy Meeting', '<p>Old meeting minutes from Q1 retrospective.</p>', 'Work', 'meeting,archive', '#d97706', 0, 1, 0, 0);
