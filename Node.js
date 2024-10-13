// Example server-side login route in Node.js (Express)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In a real app, fetch user from a database here instead of hardcoding
    const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'user1', password: 'user123', role: 'user' }
    ];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ role: user.role }); // Send user role to the client
    } else {
        res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }
});
