import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, "musik");
const outputFile = path.join(__dirname, "playlist.json");
const extensions = [".mp3", ".wav", ".ogg", ".m4a"];

if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
}

/** @type {string[]} */
const files = fs
  .readdirSync(musicDir)
  .filter((/** @type {string} */ file) =>
    extensions.includes(path.extname(file).toLowerCase())
  );

const playlist = files.map((/** @type {string} */ file, /** @type {number} */ index) => {
  const cleanTitle = path.basename(file, path.extname(file)).replace(/[-_]+/g, " ");
  return {
    id: index + 1,
    title: cleanTitle,
    artist: "YTTA SOCIETY",
    duration: "Audio",
    src: `musik/${encodeURIComponent(file)}`
  };
});

fs.writeFileSync(outputFile, JSON.stringify(playlist, null, 2));
console.log(`Berhasil memperbarui playlist.json (${playlist.length} lagu).`);
