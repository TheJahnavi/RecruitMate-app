const fs = require('fs');
const path = require('path');

// Read the client package.json
const clientPackagePath = path.join(__dirname, 'SmartHire', 'client', 'package.json');
const clientPackage = JSON.parse(fs.readFileSync(clientPackagePath, 'utf8'));

// Create a temporary package.json in the client directory with just the dependencies
const tempPackage = {
  name: "smarthire-client-temp",
  version: "0.0.0",
  dependencies: clientPackage.dependencies,
  devDependencies: clientPackage.devDependencies
};

// Write temporary package.json
const tempPackagePath = path.join(__dirname, 'SmartHire', 'client', 'temp-package.json');
fs.writeFileSync(tempPackagePath, JSON.stringify(tempPackage, null, 2));

console.log('Temporary package.json created. Now run npm install in the client directory.');