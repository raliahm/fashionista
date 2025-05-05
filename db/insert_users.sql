-- Insert sample Users
INSERT INTO Users (UserID, Email, UserPassword, FirstName, LastName, UserType)
VALUES 
  (1, 'admin@example.com', 'adminhashedpw123', 'Alice', 'Admin', 'admin'),
  (2, 'shopper1@example.com', 'shopperhashedpw1', 'Bob', 'Barker', 'shopper'),
  (3, 'shopper2@example.com', 'shopperhashedpw2', 'Carol', 'Carter', 'shopper'),
  (4, 'shopper3@example.com', 'shopperhashedpw3', 'David', 'Doyle', 'shopper'),
  (5, 'shopper4@example.com', 'shopperhashedpw4', 'Eve', 'Ellis', 'shopper');
