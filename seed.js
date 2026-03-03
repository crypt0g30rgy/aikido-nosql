require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Blog = require("./models/Blog");

module.exports = async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany({});
        await Employee.deleteMany({});
        await Blog.deleteMany({});

        const users = await User.create([
            { username: 'admin', password: 'password123', email: 'admin@example.com', role: 'admin' },
            { username: 'user1', password: 'user1pass', email: 'user1@example.com', role: 'user' },
            { username: 'user2', password: 'user2pass', email: 'user2@example.com', role: 'user' },
            { username: 'jane_doe', password: 'secure_pass', email: 'jane@example.com', role: 'user' }
        ]);

        const employees = await Employee.create([
            { name: 'John Smith', email: 'john@company.com' },
            { name: 'Sarah Connor', email: 'sarah@resistance.com' },
            { name: 'Bruce Wayne', email: 'bruce@waynecorp.com' }
        ]);

        const blogs = await Blog.create([
            { title: 'NoSQL Injection Basics', content: 'In this blog post, we discuss...' },
            { title: 'Advanced MongoDB Security', content: 'Securing your database is...' },
            { title: 'Mongoose Patterns', content: 'Learning Mongoose is fun...' }
        ]);

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding error:', err);
        throw err;
    }
};