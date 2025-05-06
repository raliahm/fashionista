// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/fashionista.db')
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');

const clientId = 'AZ6OCxO_JolQ2NyAnO2r9xt_k52BCOqd25veUKfkjE3HahNH9sMeO9YJTxqjr_xxA-rUNWdmqwWQahji';
const clientSecret = 'EKvCvkx0l_L47DozU-QlwAUmuDQAV9sEBOWJpZkzK3gnrG-7nctSDnIozYqeQz7huoWwz-kh1d_mjC7w';
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
        pending--;
        if (pending === 0) resolve();
        return;
      }
      db.get(findCategorySql, [category], (err, row) => {
        if (err) return reject(err);

        const insertProduct = (categoryId) => {
          db.run(
            insertProductSql,
            [p.name, p.description, categoryId, p.price, p.image],
            (err) => {
              if (err) return reject(err);
              if (--pending === 0) resolve();
            }
          );
        };

        if (row) {
          insertProduct(row.CategoryID);
        } else {
          db.run(insertCategorySql, [category], function (err) {
            if (err) return reject(err);
            insertProduct(this.lastID);
          });
        }
      });
    });
  });
}

async function getPaypalAccessToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 
    'grant_type=client_credentials', 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      }
    });
  
  return response.data.access_token;
}

// Route to handle PayPal Checkout
app.post('/api/checkout/paypal', async (req, res) => {
  const { cartId, userId, totalPrice, totalQuantity, shippingAddress, email, phone } = req.body;

  try {
    // Get PayPal Access Token
    const accessToken = await getPaypalAccessToken();

    // Step 1: Create PayPal Order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalPrice,
        },
        description: `Total Quantity: ${totalQuantity} items`,
        shipping: {
          address: {
            address_line_1: shippingAddress,
            admin_area_2: 'City', // Change as needed
            admin_area_1: 'State', // Change as needed
            postal_code: 'PostalCode', // Change as needed
            country_code: 'US', // Change as needed
          },
        },
      }],
      payer: {
        email_address: email,
        phone: {
          phone_type: 'MOBILE', // or LANDLINE
          phone_number: phone,
        },
      },
    };

    // Make the request to create the order
    const response = await axios.post('https://api.sandbox.paypal.com/v2/checkout/orders', orderPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const orderID = response.data.id;

    // Send the PayPal order ID back to the frontend
    res.json({ success: true, orderId: orderID });
  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    res.status(500).json({ success: false, message: 'Payment failed. Please try again.' });
  }
});
// Route to handle PayPal Checkout
app.post('/api/checkout/paypal', async (req, res) => {
  const { cartId, userId, totalPrice, totalQuantity, shippingAddress, email, phone } = req.body;

  try {
    // Get PayPal Access Token
    const accessToken = await getPaypalAccessToken();

    // Step 1: Create PayPal Order
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: totalPrice,
        },
        description: `Total Quantity: ${totalQuantity} items`,
        shipping: {
          address: {
            address_line_1: shippingAddress,
            admin_area_2: 'City', // Change as needed
            admin_area_1: 'State', // Change as needed
            postal_code: 'PostalCode', // Change as needed
            country_code: 'US', // Change as needed
          },
        },
      }],
      payer: {
        email_address: email,
        phone: {
          phone_type: 'MOBILE', // or LANDLINE
          phone_number: phone,
        },
      },
    };

    // Make the request to create the order
    const response = await axios.post('https://api.sandbox.paypal.com/v2/checkout/orders', orderPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const orderID = response.data.id;

    // Send the PayPal order ID back to the frontend
    res.json({ success: true, orderId: orderID });
  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    res.status(500).json({ success: false, message: 'Payment failed. Please try again.' });
  }
});
// Route to capture PayPal Order
const { addCheckoutRecord } = require('./controller/productController'); 

app.post('/api/checkout/capture', async (req, res) => {
  const { orderId, cartId, userId, totalPrice, totalQuantity, shippingAddress, email, phone } = req.body;

  try {
    const accessToken = await getPaypalAccessToken();


    // Fetch cart items
    db.all(`SELECT * FROM CartItems WHERE CartID = ?`, [cartId], async (err, rows) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch cart items' });
      }

      const items = rows;

      // Insert checkout record using existing logic
      addCheckoutRecord(
        cartId,
        userId,
        totalPrice,
        totalQuantity,
        shippingAddress,
        'paypal', // use 'paypal' as dummy card number
        paymentDetails.id, // store PayPal order ID in CardCV field
        items,
        (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Failed to save PayPal order' });
          }
          return res.json({ success: true, message: 'PayPal order saved', orderId: result.orderId });
        }
      );
    });

  } catch (error) {
    console.error('Error capturing PayPal payment:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to capture payment' });
  }
});


function saveOrderToDatabase(paymentDetails) {
  return new Promise((resolve, reject) => {
    const payer = paymentDetails.payer;
    const purchase = paymentDetails.purchase_units[0];
    const shipping = purchase.shipping;
    const amount = purchase.amount.value;
    const cartStatus = 'purchased';

    const shippingAddress = shipping?.address?.address_line_1 || 'N/A';
    const email = payer.email_address || 'N/A';
    const phone = payer.phone?.phone_number?.national_number || 'N/A';
    const userId = 1; // Replace with actual user ID if available

    // Insert order into your database
    const sql = `
      INSERT INTO Orders (UserID, TotalPrice, ShippingAddress, Email, Phone, CartStatus, PaymentMethod, PaymentID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      amount,
      shippingAddress,
      email,
      phone,
      cartStatus,
      paymentDetails.id
    ];

    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(true);
    });
  });
}




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/nail-photos', express.static(path.join(__dirname, 'public', 'nail-photos')));

const productRoutes = require('./routes/product-route'); // Adjust path as needed
app.use('/api', productRoutes);

app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
