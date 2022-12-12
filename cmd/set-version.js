const fs = require("fs");

const file = process.argv[2]; // path to package.json
const version = process.argv[3]; // new version

console.log(`Updating version=${version} in ${file}`);

const content = JSON.parse(fs.readFileSync(file, "utf-8"));

content.version = version;

fs.writeFileSync(file, JSON.stringify(content, null, 2));
