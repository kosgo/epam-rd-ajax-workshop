import express from 'express';
import fs from 'fs';
import users from './config/users';
import posts from './config/posts';
import jwt from 'jsonwebtoken';
import { verifyToken } from './verifyToken';
import { TOKEN_SECRET } from "./constants";

const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send(`
        <ul>
            <li>POST /api/login</li>
            <li>POST /api/register</li>
            <li>GET  /api/posts</li>
            <li>POST /api/posts</li>
        </ul>
    `);
});

app.post('/api/login', (req, res) => {
    const user = users.find(u => req.body.login === u.login && req.body.password === u.password);

    if (!user) {
        res.status(400).send({ message: 'Wrong login / password' });
        return;
    }

    const jwtToken = jwt.sign({ id: user.id }, TOKEN_SECRET);
    res.header('Authorization', `Bearer ${jwtToken}`);
    res.send();
});

app.post('/api/register', (req, res) => {
    const isValidBody =
        typeof req.body.login === 'string'
        && typeof req.body.password === "string"
        && req.body.login.length >= 3
        && req.body.password.length >= 3
        && typeof req.body.firstName === "string"
        && typeof req.body.lastName === "string";
    if (!isValidBody) {
        res.status(400).send({ message: 'Invalid data' });
        return;
    }

    const alreadyExists = users.find(u => u.login === req.body.login);
    if (alreadyExists) {
        res.status(400).send({ message: 'User already exists' });
        return;
    }

    users.push({
        id: users.length,
        login: req.body.login,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    fs.writeFile('./src/config/users.json', JSON.stringify(users), error => {
        if (error) {
            res.status(500).send({ message: 'Internal server error' });
            return;
        }

        res.send({
            login: req.body.login,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
    });
});

app.use(verifyToken);
app.get('/api/posts', (req, res) => {
    res.send(posts);
});

app.post('/api/posts', (req, res) => {
    const isValid =
        typeof req.body.title === "string"
        && typeof req.body.author === "string"
        && typeof req.body.image === "string"
        && Array.isArray(req.body.keywords)
        && typeof req.body.articleBody === "string"
        && typeof req.body.shortDescription === "string";

    if (!isValid) {
        res.status(400).send({ message: 'Invalid data' });
        return;
    }

    posts.push({
        "id": posts.length,
        "title": req.body.title,
        "author": req.body.author,
        "image": req.body.image,
        "keywords": req.body.keywords,
        "articleBody": req.body.articleBody,
        "shortDescription": req.body.shortDescription
    });
    fs.writeFile('./src/config/posts.json', JSON.stringify(posts), error => {
       if (error) {
           res.status(500).send({ message: 'Internal server error' });
           return;
       }

       res.send({ message: 'Post was successfully created' });
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
