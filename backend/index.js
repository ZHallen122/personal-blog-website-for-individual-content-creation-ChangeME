import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './database.sqlite';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Don't forget to change this!

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Could not connect to the database:", err.message);
        return;
    }

    const initSchema = fs.readFileSync('./schema.sql', 'utf-8');
    db.exec(initSchema, (err) => {
        if (err) {
            console.error('Error executing schema:', err.message);
        } else {
            console.log("Database schema initialized successfully.");
        }
    });
});

// Middleware for checking JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// User Registration
app.post('/api/users', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.run(query, [username, email, hashedPassword], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ message: 'Username or email already exists' });
            }
            return res.status(400).json({ message: 'Invalid input' });
        }
        res.status(201).json({ userID: this.lastID, username, email, createdAt: new Date() });
    });
});

// User Login
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.get(query, [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Get User Profile
app.get('/api/users/:id', authenticateJWT, (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT id, username, profilePicture, createdAt FROM users WHERE id = ?';

    db.get(query, [userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    });
});

// Create Blog Post
app.post('/api/posts', authenticateJWT, (req, res) => {
    const { title, content, featuredImage } = req.body;
    const query = 'INSERT INTO posts (title, content, featuredImage, userId) VALUES (?, ?, ?, ?)';
    
    db.run(query, [title, content, featuredImage, req.user.id], function (err) {
        if (err) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        res.status(201).json({ postID: this.lastID, title, createdAt: new Date(), updatedAt: new Date() });
    });
});

// Get Blog Post
app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT * FROM posts WHERE id = ?';

    db.get(query, [postId], (err, post) => {
        if (err || !post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const userQuery = 'SELECT username, profilePicture FROM users WHERE id = ?';
        db.get(userQuery, [post.userId], (err, user) => {
            post.user = user || {};
            res.json(post);
        });
    });
});

// Create a Comment on Post
app.post('/api/posts/:id/comments', authenticateJWT, (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    const query = 'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)';

    db.run(query, [postId, req.user.id, content], function (err) {
        if (err) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        res.status(201).json({ commentID: this.lastID, content, createdAt: new Date() });
    });
});

// Get Comments for a Post
app.get('/api/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const query = 'SELECT comments.id AS commentID, comments.content, comments.createdAt, users.username FROM comments LEFT JOIN users ON comments.userId = users.id WHERE comments.postId = ?';

    db.all(query, [postId], (err, comments) => {
        if (err) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(comments);
    });
});

// Update a Blog Post
app.put('/api/posts/:id', authenticateJWT, (req, res) => {
    const postId = req.params.id;
    const { title, content, featuredImage } = req.body;
    const query = 'UPDATE posts SET title = ?, content = ?, featuredImage = ? WHERE id = ? AND userId = ?';

    db.run(query, [title, content, featuredImage, postId, req.user.id], function (err) {
        if (err) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ updatedAt: new Date() });
    });
});

// Delete a Blog Post
app.delete('/api/posts/:id', authenticateJWT, (req, res) => {
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE id = ? AND userId = ?';

    db.run(query, [postId, req.user.id], function (err) {
        if (err || this.changes === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post successfully deleted' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});