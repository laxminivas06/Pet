// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Load users from JSON file
function loadUsers() {
  const data = fs.readFileSync(path.join(__dirname, 'database.json'));
  return JSON.parse(data).users;
}

// Save users to JSON file
function saveUsers(users) {
  fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({ users }, null, 2));
}

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const users = loadUsers();

  console.log('Loaded users:', users); // Log the loaded users

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User  already exists' });
  }

  // Add new user
  users.push({ name, email, password });
  saveUsers(users);
  res.status(201).json({ message: 'User  registered successfully' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});