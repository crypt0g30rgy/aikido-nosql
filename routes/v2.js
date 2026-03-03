const express = require('express');
const router = express.Router();
const v2Controller = require('../controllers/v2Controller');

/**
 * @swagger
 * /api/v2/users:
 *   get:
 *     summary: Get all users (vulnerable find)
 */
router.get('/users', v2Controller.findUsers);

/**
 * @swagger
 * /api/v2/users/search:
 *   get:
 *     summary: Search users (vulnerable regex)
 */
router.get('/users/search', v2Controller.search);

/**
 * @swagger
 * /api/v2/users/login:
 *   post:
 *     summary: Login (vulnerable findOne)
 */
router.post('/users/login', v2Controller.findOne);

/**
 * @swagger
 * /api/v2/users/{id}:
 *   get:
 *     summary: Get user by ID
 */
router.get('/users/:id', v2Controller.findById);

/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     summary: Create user
 */
router.post('/users', v2Controller.create);

/**
 * @swagger
 * /api/v2/users:
 *   put:
 *     summary: Update users (vulnerable updateMany)
 */
router.put('/users', v2Controller.update);

/**
 * @swagger
 * /api/v2/users:
 *   delete:
 *     summary: Delete users (vulnerable deleteMany)
 */
router.delete('/users', v2Controller.delete);

// Employees & Blogs (Many-to-Many)

/**
 * @swagger
 * /api/v2/employees:
 *   get:
 *     summary: Get employees
 */
router.get('/employees', v2Controller.findEmployees);

/**
 * @swagger
 * /api/v2/blogs:
 *   get:
 *     summary: Get blogs
 */
router.get('/blogs', v2Controller.findBlogs);

/**
 * @swagger
 * /api/v2/blogs/author:
 *   post:
 *     summary: Add author to blog
 */
router.post('/blogs/author', v2Controller.addAuthorToBlog);

/**
 * @swagger
 * /api/v2/blogs/searchByAuthor:
 *   post:
 *     summary: Search blogs by author
 */
router.post('/blogs/searchByAuthor', v2Controller.findBlogsByAuthor);

module.exports = router;
