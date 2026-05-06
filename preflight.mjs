import fs from "node:fs";
import net from "node:net";

const failures = [];
const port = Number.parseInt(process.env.PORT || "8792", 10);
const major = Number.parseInt(process.versions.node.split(".")[0], 10);

if (!Number.isFinite(major) || major < 20) failures.push(`Node.js 20+ is required. Current version: ${process.version}`);

for (const file of ["server.mjs", "package.json", "railway.json", ".env.example"]) {
  if (!fs.existsSync(file)) failures.push(`Missing required file: ${file}`);
}

await new Promise((resolve) => {
  const server = net.createServer();
  server.once("error", () => {
    failures.push(`Port ${port} is already in use. Set PORT to another value.`);
    resolve();
  });
  server.once("listening", () => server.close(resolve));
  server.listen(port, "127.0.0.1");
});

if (failures.length) {
  console.error("Preflight failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, preflight: "passed", port }, null, 2));
