// Import required modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

// Initialize the application
const app = express();
const PORT = 3000;
const DATA_FILE = 'users.json';

// Middleware setup
app.use(bodyParser.json());

// Utility functions
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.post('/add_user', (req, res) => {
    const { email, age } = req.body;
    if (!email || !age) {
        return res.status(400).json({ message: 'Email and age are required.' });
    }

    let users = readData();
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    users.push({ email, age });
    writeData(users);
    res.status(201).json({ message: 'User added successfully.' });
});

app.get('/user/:email', (req, res) => {
    const { email } = req.params;
    const users = readData();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
});

app.put('/user/:email', (req, res) => {
    const { email } = req.params;
    const { age } = req.body;
    let users = readData();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    users[userIndex].age = age;
    writeData(users);
    res.json({ message: 'User updated successfully.' });
});

app.delete('/user/:email', (req, res) => {
    const { email } = req.params;
    let users = readData();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    users.splice(userIndex, 1);
    writeData(users);
    res.json({ message: 'User deleted successfully.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/* cURL Commands:

1. Add a user:
curl -X POST http://localhost:3000/add_user -H "Content-Type: application/json" -d '{"email":"Alikhan.behzad@gmail.com", "age":29}'

2. Retrieve user information:
curl -X GET http://localhost:3000/user/user@example.com

3. Update user information:
curl -X PUT http://localhost:3000/user/Alikhan.behzad@gmail.com -H "Content-Type: application/json" -d '{"age":35}'

4. Delete user information:
curl -X DELETE http://localhost:3000/user/Alikhan.behzad@gmail.com.com
Use Get Request to retrieve user information
curl.exe -X GET http://localhost:3000/user/Alikhan.behzad@gmail.com

*/

