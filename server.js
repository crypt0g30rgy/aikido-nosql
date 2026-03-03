require("dotenv").config({ path: "./.env" });
require("@aikidosec/firewall");

const express = require("express");
const mongoose = require("mongoose");
const os = require("os");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const seed = require("./seed");
const options = require("./swagger");

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Validate required environment variables
    if (!process.env.API_USER || !process.env.API_PASS) {
      throw new Error("API_USER or API_PASS environment variables are not set.");
    }

    console.log("RUN_SEED value:", process.env.RUN_SEED);

    // Single MongoDB connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Conditional seeding
    if (process.env.RUN_SEED === "true") {
      console.log("⚠ Running seed...");
      await seed();
      console.log("Seeding complete.");
    }

    // Middleware
    app.use(express.json());

    // Routes
    app.use("/", require("./routes/index"));

    // Swagger docs
    const specs = swaggerJsdoc(options);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ PathException: "Endpoint Not Found" });
    });

    // Start server
    app.listen(PORT, () => {
      const interfaces = os.networkInterfaces();
      console.log(`API running on:`);

      Object.keys(interfaces).forEach((name) => {
        interfaces[name].forEach((iface) => {
          if (iface.family === "IPv4" && !iface.internal) {
            console.log(`- http://${iface.address}:${PORT}`);
          }
        });
      });

      console.log(`- http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
}

startServer();