import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");
const file = path.join(dataDir, "leads.json");

if (fs.existsSync(file)) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const filtered = data.filter((u) => !u.id.startsWith("d9e8f7a6-"));
  fs.writeFileSync(file, JSON.stringify(filtered, null, 2), "utf8");
  console.log("Filtered leads.json. Remaining real leads:", filtered.length);
}

const sqliteFile = path.join(dataDir, "digital_taqwa.sqlite");
if (fs.existsSync(sqliteFile)) {
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(sqliteFile);
    db.exec("DELETE FROM waitlist_users WHERE id LIKE 'd9e8f7a6-%'");
    console.log("Cleaned mock records from SQLite database.");
  } catch (err) {
    console.log("SQLite clean info:", err.message);
  }
}
