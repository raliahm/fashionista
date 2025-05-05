// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');


// Create an instance of Express app
const app = express();

// Specify the port for the app to listen on
const port = 3000;

// Configure static file serving (e.g., images, stylesheets)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

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
app.get('/product-listing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-listing.html'));
});

app.get('/product-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'product-upload.html'));
});

// Example file upload endpoint using Multer
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully!');
});




// Example route to fetch data from SQLite
/** app.get('/users', (req, res) => {
  db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    res.json(rows);
  });
}); **/

const productRoutes = require('./routes/product-route'); // Adjust path as needed
app.use('/api', productRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
