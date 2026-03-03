const Employee = require('../models/Employee');
const Blog = require('../models/Blog');
const User = require('../models/User');

// V1: Mongoose (Intentionally Vulnerable)

exports.findUsers = async (req, res) => {
    try {

        // to ensure we use filters

        if (!req.query.username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        console.log(req.query);

        // const users = await User.find(req.query);

        const query = User.find(req.query);

        console.log("Mongo filter object:", query.getFilter());

        const users = await query;

        if (users.length === 0) {
            console.log("No users found:", req.query, "failed to bypass waf");
            res.status(404).json({ message: "No users found" });
        } else {
            console.log("Users found:", users.length, ":", req.query, "bypassed waf");
            res.json(users);
        }

    } catch (err) {
        // console.error('[!] Unexpected error:', err);
        if (
            err.message &&
            err.message.includes('Zen has blocked a NoSQL injection:')
        ) {
            console.error('[!] Blocked by Zen Security');
            return res.status(403).json({ message: "Blocked by Security.", error: err.message });
        }

        res.status(500).json({ error: err.message });
    }
};

// find one

exports.findOneUser = async (req, res) => {
    try {

        // to ensure we use filters

        if (!req.query.username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        console.log(req.query);

        // const users = await User.find(req.query);

        const query = User.findOne(req.query);

        console.log("Mongo filter object:", query.getFilter());

        const user = await query;

        if (!user) {
            console.log("No user found:", req.query, "failed to bypass waf");
            res.status(404).json({ message: "No user found" });
        } else {
            console.log("User found:", user, ":", req.query, "bypassed waf");
            res.json(user);
        }

    } catch (err) {
        // console.error('[!] Unexpected error:', err);
        if (
            err.message &&
            err.message.includes('Zen has blocked a NoSQL injection:')
        ) {
            console.error('[!] Blocked by Zen Security');
            return res.status(403).json({ message: "Blocked by Security.", error: err.message });
        }

        res.status(500).json({ error: err.message });
    }
};

exports.findEmployees = async (req, res) => {
    try {
        // Vulnerable: req.query passed directly, allowing $where or other operators
        const employees = await Employee.find(req.query).populate('blogs');
        res.json(employees);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// vulnerable to populate
exports.findBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find(req.query).populate('authors');
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Many-to-Many: Vulnerable assignment
exports.addAuthorToBlog = async (req, res) => {
    try {
        const { blogId, employeeId } = req.body;
        // Vulnerable: no validation of IDs, potential for bulk update or other mischief if IDs are objects
        const blog = await Blog.findByIdAndUpdate(blogId, { $push: { authors: employeeId } }, { new: true });
        const employee = await Employee.findByIdAndUpdate(employeeId, { $push: { blogs: blogId } }, { new: true });
        res.json({ blog, employee });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findBlogsByAuthor = async (req, res) => {
    try {
        // Vulnerable: passing req.body to find() for many-to-many join-like query
        // const blogs = await Blog.find({ authors: { $in: req.body.authors } }).populate('authors');
        const blogs = await Blog.find(req.body).populate('authors');
        res.json(blogs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Original methods kept for continuity
exports.findOne = async (req, res) => {
    try {
        const user = await User.findOne(req.body);
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
};


// Vulnerable distinct
exports.vulnDistinctRoles = async (req, res) => {
    try {
        // const roles = await User.distinct('role', req.query);
        const roles = await User.distinct(req.query);

        res.json(roles);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


// Vulnerable aggregate (user can send pipeline)
exports.vulnAggregateUsers = async (req, res) => {
    try {
        const pipeline = req.body.pipeline || [];
        const result = await User.aggregate(pipeline);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};


// vulnerable to regex
exports.search = async (req, res) => {
    try {
        const users = await User.find({
            username: { $regex: req.query.username || '', $options: 'i' }
        });
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// vulnerable to mass assignment
exports.create = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
    try {
        const result = await User.updateMany(req.query, req.body);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
    try {
        const result = await User.deleteMany(req.query);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
