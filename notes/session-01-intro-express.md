## Js vs NodeJs
Js is a language. Node.js is a runtime environment.

Let's start by creating a server.
Create a node backend repo and checkout a branch.

Node by default provides lots of libraries/utilities for supporting different cases like creating an HTTP server, file management, streams, etc.

### Sample "http" - app.js
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url);
    res.writeHead(200);
    res.end('Hello world');
});

server.listen(3000, () => {
    console.log('server listening to 3000');
});
```

To run the above code, execute: `node app.js`.

### How to install libraries other than the above ones?
NPM - Node Package Manager - to download all libraries registered in the npm registry.
Run the command: `npm init -y`

#### package.json
Describes all the metadata, dependencies, etc.

```json
{
    "name": "projectname",
    "version": "project version",
    "main": "starting entry of our project",
    "scripts": {
        "start-server": "node app.js"
    }
}
```

In the above values, there is more relevance when you publish your project as a library. In our case, it is a web server.
To start the server using the custom script, run: `npm run start-server`.

### EXPRESS
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
To install Express, run: `npm i express`.
Explain dependencies in package.json and version concept-  "express": "^4.18.2" and package-lock.json
Explain node_modules.

## Versioning Guidelines

| Code status                     | Stage           | Rule                           | Example version |
|---------------------------------|-----------------|--------------------------------|-----------------|
| First release                   | New product     | Start with 1.0.0               | 1.0.0           |
| Backward compatible bug fixes   | Patch release   | Increment the third digit      | 1.0.1           |
| Backward compatible new features| Minor release   | Increment the middle digit and reset last digit to zero | 1.1.0 |
| Changes that break backward compatibility | Major release | Increment the first digit and reset middle and last digits to zero | 2.0.0 |


// Function to calculate the average of two numbers - 1.0.0
function average(a, b) {
  return (a + b) / 2;
}

// Version 1.0.1 (Patch Release)
function average(a, b) {
  // Fixing the bug by using parseFloat to handle decimal numbers
  a = parseFloat(a);
  b = parseFloat(b);
  return (a + b) / 2;
}


// Version 1.1.0 (Minor Release)
function average(...numbers) {
// Support any numbers
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
}

// Version 2.0.0 (major Release)
// Decimal number round to specified precision
function average(precision, ...numbers) {
  const sum = numbers.reduce((total, num) => total + num, 0);
  return (sum / numbers.length).toFixed(precision);
}


## Specifying Acceptable Update Types

To specify which update types your package can accept from dependencies, you can define version ranges in your package's `package.json` file.

For example, to specify acceptable version ranges up to `1.0.4`, you can use the following syntax:

- Patch releases: `1.0` or `1.0.x` or `~1.0.4`
- Minor releases: `1` or `1.x` or `^1.0.4`
- Major releases: `*` or `x`


### app.js (modified)
```javascript
const express = require('express');
const server = express();

server.get('/', (req, res) => {
    console.log(req.url);
    res.status(200).send('Hello world');
});

server.listen(3000, () => {
    console.log('server listening to 3000');
});
```

### ISSUE OF Javascript
```javascript
const data = "string data";
const data1 = {
    profile: {
        age: 20,
        name: "employee_name"
    }
};
console.log(data.profile.age);
```
