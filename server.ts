import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser with limit for payload
  app.use(express.json({ limit: "15mb" }));

  // Path to local persistent JSON file
  const DATA_FILE = path.join(process.cwd(), "menu_items.json");

  // API to retrieve menu items from file or signal client to initialize from metadata
  app.get("/api/menu-items", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return res.json(JSON.parse(data));
      } else {
        // Return null so frontend can upload local data to initialize the server file
        return res.json(null);
      }
    } catch (e: any) {
      console.error("Error reading menu_items.json:", e);
      return res.status(500).json({ error: e.message || "Failed to read menu items" });
    }
  });

  // API to store or update the menu items in the local file
  app.post("/api/menu-items", (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid data format. Expected an array." });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
      return res.json({ success: true, count: items.length });
    } catch (e: any) {
      console.error("Error writing menu_items.json:", e);
      return res.status(500).json({ error: e.message || "Failed to write menu items" });
    }
  });

  // Vite development middleware vs. static production production assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware initiated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
