const express = require("express");
const router = express.Router();

const { getRoot } = require("../controllers/index");

//Get Root

/**
 * @swagger
 * tags:
 *   name: Root
 *   description: the Root
 * /:
 *   get:
 *     summary: Return the Root Message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Root Message
 */

router.get("/", getRoot)

// API Versions
router.use("/api/v1", require("./v1"));
router.use("/api/v2", require("./v2"));

module.exports = router;