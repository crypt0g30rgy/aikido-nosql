const { connectDB } = require('../lib/db');
const { ObjectId } = require('mongodb');

// V2: MongoDB Native Driver (Intentionally Vulnerable)

exports.findUsers = async (req, res) => {
    try {
        const db = await connectDB();

        // Require username filter (lab constraint)
        if (!req.query.username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        // Log raw incoming query (before MongoDB sees it)
        console.log("Incoming req.query:", JSON.stringify(req.query, null, 2));

        // This is the exact Mongo filter being sent
        const mongoFilter = { ...req.query };

        console.log("Mongo filter object:", JSON.stringify(mongoFilter, null, 2));

        const users = await db
            .collection('users')
            .find(mongoFilter)
            .toArray();

        if (users.length === 0) {
            console.log(
                "No users found:",
                JSON.stringify(mongoFilter),
                "→ failed to bypass WAF"
            );
        } else {
            console.log(
                "Users found:",
                users.length,
                ":",
                JSON.stringify(mongoFilter),
                "→ bypassed WAF"
            );
        }

        res.json(users);

    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.findEmployees = async (req, res) => {
    try {
        const db = await connectDB();
        // Vulnerable: Direct query
        const employees = await db.collection('employees').find(req.query).toArray();
        res.json(employees);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findBlogs = async (req, res) => {
    try {
        const db = await connectDB();
        const blogs = await db.collection('blogs').find(req.query).toArray();
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Many-to-Many: Vulnerable join-like operation
exports.addAuthorToBlog = async (req, res) => {
    try {
        const db = await connectDB();
        const { blogId, employeeId } = req.body;
        // Vulnerable: Raw input into update operations
        const blogResult = await db.collection('blogs').updateOne(
            { _id: blogId.length === 24 ? new ObjectId(blogId) : blogId },
            { $push: { authors: employeeId.length === 24 ? new ObjectId(employeeId) : employeeId } }
        );
        const employeeResult = await db.collection('employees').updateOne(
            { _id: employeeId.length === 24 ? new ObjectId(employeeId) : employeeId },
            { $push: { blogs: blogId.length === 24 ? new ObjectId(blogId) : blogId } }
        );
        res.json({ blogResult, employeeResult });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findBlogsByAuthor = async (req, res) => {
    try {
        const db = await connectDB();
        // Vulnerable: req.body.authors could be a malicious object
        const blogs = await db.collection('blogs').find({ authors: { $in: req.body.authors } }).toArray();
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Original methods
exports.findOne = async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne(req.body);
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findById = async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('users').insertOne(req.body);
        res.status(201).json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('users').updateMany(req.query, { $set: req.body });
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection('users').deleteMany(req.query);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.search = async (req, res) => {
    try {
        const db = await connectDB();
        const users = await db.collection('users').find({
            username: { $regex: req.query.username || '', $options: 'i' }
        }).toArray();
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
