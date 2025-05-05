-- Users table
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    UserPassword TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserType TEXT CHECK(UserType IN ('admin', 'shopper'))
);

-- Categories table
CREATE TABLE Categories (
    CategoryID INTEGER PRIMARY KEY,
    CategoryName TEXT NOT NULL
);

-- Products table
CREATE TABLE Products (
    ProductID INTEGER PRIMARY KEY,
    ProductName TEXT NOT NULL,
    ProductDescription TEXT NOT NULL,
    ProductImageURL TEXT NOT NULL,
    ProductPrice REAL NOT NULL,
    CategoryID INTEGER,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Carts table
CREATE TABLE Carts (
    CartID INTEGER PRIMARY KEY,
    CartStatus TEXT CHECK(CartStatus IN ('new', 'abandoned', 'purchased')),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- CartProducts table
CREATE TABLE CartProducts (
    CartProductID INTEGER PRIMARY KEY,
    CartID INTEGER,
    ProductID INTEGER,
    Quantity INTEGER NOT NULL,
    FOREIGN KEY (CartID) REFERENCES Carts(CartID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
CREATE TABLE Orders (
  OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
  CartID INTEGER NOT NULL,
  UserID INTEGER,
  ShippingAddress TEXT NOT NULL,
  CardNumber TEXT NOT NULL,
  CardCV INTEGER NOT NULL,
  OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  OrderStatus TEXT CHECK(OrderStatus IN ('delivered', 'processing', 'shipped', 'cancelled')) DEFAULT 'processing',	
  FOREIGN KEY (CartID) REFERENCES Carts(CartID),
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
