### Add logs

Logging is already explained in the previous session. Give a brief:

- Logging is the history book of the application.
- It records all the activities of the application.

#### Add logging to the endpoints

- Add logging to the endpoints in `app.ts`
- Add logging to the endpoints in `employee_router.ts`

#### Brief about other middleware use-cases

- Rate-limiting: Limit the number of requests to the server. This is useful to prevent the server from being overloaded and attack by bots like DDOS.
- Authentication: Authenticate the user, check if the user is logged in.
- Authorization: Authorize the user, check if the user has the permission to access the resource.

#### Explain the pain point

- Repeated code in each handler.
- Hard to maintain.
- Hard to extend.
- Developer overhead.

> Middleware is the solution to the problem.

## Explain Middleware and Why it is useful

- Middleware is the middleman between the client request and the route handlers.
- Middleware has the ability to modify request and response objects or perform specific tasks before passing the control to the next middleware or route handler.
- Middleware in Express is a function that can access the request and response objects.
- Middleware is useful to perform operations such as authentication, logging, parsing, error handling, etc., without directly affecting the route handlers.

## Add Logger Middleware

```javascript
const loggerMiddleware = (req, res, next) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${
        res.statusCode
      }`
    );
  });
  // Call next middleware, or handler
  next();
};

export default loggerMiddleware;
```

To use the logger middleware, update `app.ts`:

```javascript
import express from "express";
import loggerMiddleware from "./loggerMiddleware";

const server = express();

server.use(loggerMiddleware);
```

- Run the endpoints and check the console logs.
- Remove the logs in the route handlers.

> Run `POST /employee` and check the console logs - Should show error.

## Add Body Parser Middleware

Explain that the endpoint `POST /employee` is not able to parse the request body.

```javascript
import express from "express";
import loggerMiddleware from "./path/to/loggerMiddleware";

const server = express();

// Use the logger middleware
server.use(loggerMiddleware);

// Use the body-parser middleware to parse JSON data
server.use(express.json());
```

Now you have a sample logger middleware and the body-parser middleware added to your Express server.

> Run `POST /employee`.

## Exercise: Add Process Time Middleware

- Add a middleware that logs the time taken to process the request.
- Use the `processTimeMiddleware` function provided below.

```javascript
const processTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`Time taken: ${Date.now() - start}ms`);
  });
};
```

Add the middleware to the server in `app.ts`.

```javascript
import express from "express";
import loggerMiddleware from "./path/to/loggerMiddleware";
import processTimeMiddleware from "./path/to/processTimeMiddleware";

const server = express();

// Use the logger middleware
server.use(loggerMiddleware);

// Use the body-parser middleware to parse JSON data
server.use(express.json());

// Use the process time middleware
server.use(processTimeMiddleware);
```

> Run `POST /employee` and check the console logs.

Optionally, set the proessTime in the response header:

```javascript
export const processTimeMiddleware = (req, res, next) => {
  const startTime = Date.now(); // for simplicity
  const end = res.end;
  res.end = function (chunk, encoding) {
    const processTime = Date.now() - startTime;
    res.setHeader("X-Process-Time", processTime);
    end.call(res, chunk, encoding); // 'call' is not to lose the original binding of res.end to the response object
  };
  next();
};

export default processTimeMiddleware;
```

## Exercise: Add Other Handlers

- Add `PUT` and `DELETE` endpoints to the `employee_router.ts` file.
