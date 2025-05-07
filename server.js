// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/fashionista.db')
const fs = require('fs');

// Create an instance of Express app
const app = express();

// Specify the port for the app to listen on
const port = 3000;

// Configure static file serving (e.g., images, stylesheets)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


// Multer setup with file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Corrected file filter with a proper regular expression
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Only jpeg, jpg, and png files allowed
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
  const mimetype = fileTypes.test(file.mimetype); // Check file MIME type

  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed!'), false); // Reject invalid file types
  }
};

const fileFilter2 = (req, file, cb) => {
  const allowedTypes = ['.json', '.csv', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JSON, CSV, or TXT files are allowed!'));
  }
};


// Configure multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const bulkUpload = multer({
  dest: 'uploads/', // Temporary storage
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.json', '.csv', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON, CSV, or TXT files are allowed!'));
    }
  }
});


// Set up a simple route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'homepage.html'));
});
app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'homepage.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'products.html'));
});
app.get('/shopping-cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'shopping-cart.html'));

});
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'checkout.html'));  
});
app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'details.html'));
});
app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'logout.html'));
});
app.get('/product-edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-edit.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'admin.html'));
});
app.get('/product-add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-add.html'));
});
app.get('/product-listing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-listing.html'));
});

app.get('/product-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-upload.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'orders.html'));
});


// POST endpoint for adding a product
app.post("/api/products/add", upload.single("product_image"), async (req, res) => {
  const { product_name, description, category, price } = req.body;
  
  const originalFileName = req.file.filename;
  const newFileName = `${originalFileName}`; // Change extension if needed
  const originalFilePath = path.join(__dirname, 'uploads', originalFileName);
  const newFilePath = path.join(__dirname, 'uploads', newFileName);
  
  // Rename the file to ensure correct extension
  const renameFile = () => {
    return new Promise((resolve, reject) => {
      fs.rename(originalFilePath, newFilePath, (err) => {
        if (err) reject("Error renaming file");
        else resolve(newFileName); // Return the new file name
      });
    });
  };

  try {
    const newFileName = await renameFile();
    const imagePath = `/uploads/${newFileName}`;

    // Check if the category already exists in the database
    const checkCategorySql = `SELECT CategoryID FROM Categories WHERE CategoryName = ?`;
    const insertCategorySql = `INSERT INTO Categories (CategoryName) VALUES (?)`;
    const insertProductSql = `
      INSERT INTO Products (ProductName, ProductDescription, CategoryID, ProductPrice, ProductImageURL)
      VALUES (?, ?, ?, ?, ?)`;

    db.get(checkCategorySql, [category], (err, row) => {
      if (err) return res.status(500).send("Error checking category");

      const insertProduct = (categoryId) => {
        db.run(
          insertProductSql,
          [product_name, description, categoryId, price, imagePath],
          function (err) {
            if (err) return res.status(500).send("Error inserting product");
            res.redirect("/product-listing");
          }
        );
      };

      if (row) {
        insertProduct(row.CategoryID); // Category exists
      } else {
        db.run(insertCategorySql, [category], function (err) {
          if (err) return res.status(500).send("Error inserting category");
          insertProduct(this.lastID); // Use lastID for the new category
        });
      }
    });
  } catch (err) {
    console.error("Error renaming file", err);
    res.status(500).send("Error renaming the file");
  }
});

const readline = require("readline");

app.post("/upload", bulkUpload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    if (ext === ".json") {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      await insertProducts(data);
    } else if (ext === ".csv" || ext === ".txt") {
      const data = await parseCSVOrTxt(filePath);
      await insertProducts(data);
    } else {
      return res.status(400).send("Unsupported file format");
    }

    res.send("Products uploaded successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to process the file");
  }
});
function parseCSVOrTxt(filePath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });
    const results = [];
    let headers;

    rl.on("line", (line) => {
      if (!headers) {
        headers = line.split(",").map((h) => h.trim());
      } else {
        const values = line.split(",").map((v) => v.trim());
        const product = {};
        headers.forEach((key, i) => {
          product[key] = values[i];
        });
        results.push(product);
      }
    });

    rl.on("close", () => resolve(results));
    rl.on("error", reject);
  });
}
function insertProducts(products) {
  return new Promise((resolve, reject) => {
    const insertCategorySql = `INSERT INTO Categories (CategoryName) VALUES (?)`;
    const findCategorySql = `SELECT CategoryID FROM Categories WHERE CategoryName = ?`;
    const insertProductSql = `
      INSERT INTO Products (ProductName, ProductDescription, CategoryID, ProductPrice, ProductImageURL)
      VALUES (?, ?, ?, ?, ?)`;

    let pending = products.length;
    if (!pending) return resolve();

    products.forEach((p) => {
      const category = p.category?.trim() || "Uncategorized";
      if (!p.name || !p.price) {
        console.warn("Skipping invalid product row:", p);
        if (--pending === 0) resolve();
        return;
      }

      db.get(findCategorySql, [category], (err, row) => {
        if (err) {
          console.error("Error finding category:", err);
          return reject(err);
        }

        const insertProduct = (categoryId) => {
          db.run(
            insertProductSql,
            [p.name, p.description || '', categoryId, p.price, p.image || ''],
            (err) => {
              if (err) {
                console.error("Error inserting product:", p, err);
                return reject(err);
              }
              if (--pending === 0) resolve();
            }
          );
        };

        if (row) {
          insertProduct(row.CategoryID);
        } else {
          db.run(insertCategorySql, [category], function (err) {
            if (err) {
              console.error("Error inserting category:", category, err);
              return reject(err);
            }
            insertProduct(this.lastID);
          });
        }
      });
    });
  });
}


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/nail-photos', express.static(path.join(__dirname, 'public', 'nail-photos')));

const productRoutes = require('./routes/product-route'); // Adjust path as needed
app.use('/api', productRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
