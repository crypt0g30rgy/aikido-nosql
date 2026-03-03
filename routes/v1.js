const express = require('express');
const router = express.Router();
const v1Controller = require('../controllers/v1Controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: { type: string }
 *         password: { type: string }
 *         email: { type: string }
 *         role: { type: string }
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username: { type: string, example: { "$ne": "admin" } }
 *         password: { type: string, example: { "$ne": "password" } }
 *     Employee:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         email: { type: string }
 *         blogs: { type: array, items: { type: string } }
 *     Blog:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         content: { type: string }
 *         authors: { type: array, items: { type: string } }
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (vulnerable find)
 *     description: Passing query params directly to find(). Try `?username[$ne]=null`.
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', v1Controller.findUsers);


// /**
//  * @swagger
//  * /api/v1/user:
//  *   get:
//  *     summary: Get one user (vulnerable findOne)
//  *     description: Passing query params directly to findOne(). Try `?username[$ne]=null`.
//  *     responses:
//  *       200:
//  *         description: One user
//  */
router.get('/user', v1Controller.findOneUser);

/**
 * @swagger
 * /api/v1/users/search:
 *   get:
 *     summary: Search users (vulnerable regex)
 *     description: Uses regex with user input. Try `?username=^a.*`.
 *     responses:
 *       200:
 *         description: Matching users
 */
router.get('/users/search', v1Controller.search);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login (vulnerable findOne)
 *     description: Bypasable with NoSQL operators in the body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User found
 */
router.post('/users/login', v1Controller.findOne);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID (vulnerable findById)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 */
router.get('/users/:id', v1Controller.findById);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users', v1Controller.create);

/**
 * @swagger
 * /api/v1/users:
 *   put:
 *     summary: Update users (vulnerable updateMany)
 *     description: Pass raw query in query params and update in body.
 *     responses:
 *       200:
 *         description: Update result
 */
router.put('/users', v1Controller.update);

/**
 * @swagger
 * /api/v1/users:
 *   delete:
 *     summary: Delete users (vulnerable deleteMany)
 *     description: Pass raw query in query params.
 *     responses:
 *       200:
 *         description: Delete result
 */
router.delete('/users', v1Controller.delete);

// Employees & Blogs (Many-to-Many)

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get employees (vulnerable find/populate)
 *     description: Try `?blogs[$size]=2` to find employees with 2 blogs.
 */
router.get('/employees', v1Controller.findEmployees);

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get blogs (vulnerable find/populate)
 */
router.get('/blogs', v1Controller.findBlogs);

/**
 * @swagger
 * /api/v1/blogs/author:
 *   post:
 *     summary: Add author to blog (M2M)
 */
router.post('/blogs/author', v1Controller.addAuthorToBlog);

/**
 * @swagger
 * /api/v1/blogs/searchByAuthor:
 *   post:
 *     summary: Search blogs by author (vulnerable $in)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authors:
 *                 type: object
 *                 example: { "$ne": [] }
 */
router.post('/blogs/searchByAuthor', v1Controller.findBlogsByAuthor);

/**
 * @swagger
 * /api/v1/roles/distinct-roles:
 *   get:
 *     summary: Get distinct roles (vulnerable distinct)
 *     description: Try `?role[$ne]=admin`.
 */
router.get('/roles/distinct-roles', v1Controller.vulnDistinctRoles);

/**
 * @swagger
 * /api/v1/users/aggregate:
 *   post:
 *     summary: Aggregate users (vulnerable aggregate)
 *     description: Send a full aggregation pipeline in the body.
 */
router.post('/users/aggregate', v1Controller.vulnAggregateUsers);

module.exports = router;
