# Session 5: ORM, Entity, Repository, DB Connection

## 1. The Problem & Database Setup (15 min)

### 1.1 Demo the Problem
Let's start by demonstrating the current issue with our in-memory storage:

1. Start your Node.js server if it's not already running
2. Make a POST request to add a new employee:
   ```bash
   curl -X POST http://localhost:3000/employee \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com"}'
   ```
3. Verify the employee was added by making a GET request:
   ```bash
   curl http://localhost:3000/employee
   ```
4. Now, restart your Node.js server
5. Make the GET request again - the employee is gone!

### 1.2 Setting Up PostgreSQL with Docker

Let's set up PostgreSQL using Docker for persistent storage:

1. First, make sure Docker is running on your system
2. Run the following command to start a PostgreSQL container:
   ```bash
   docker run --name postgres-db -p 5432:5432 \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -d postgres
   ```

3. Verify the container is running:
   ```bash
   docker ps
   ```
   You should see the `postgres-db` container in the list

4. Let's connect to the PostgreSQL server and create our database:
   ```bash
   docker exec -it postgres-db psql -U postgres
   ```

### 1.3 Create database, table and insert entries

1. In the PostgreSQL prompt, create the training database:
   ```sql
   CREATE DATABASE training;
   \c training  -- Connect to the training database
   ```

2. Create the employee table:
   ```sql
   CREATE TABLE employee (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       name VARCHAR(255) NOT NULL,
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       deleted_at TIMESTAMP
   );
   ```

3. Add some sample data:
   ```sql
   INSERT INTO employee (email, name) VALUES 
     ('rahul.g@keyvalue.systems', 'Rahul Giridharan'),
     ('gokul.k@keyvalue.systems', 'Gokul K');
   ```

4. Verify the data was inserted:
   ```sql
   SELECT * FROM employee;
   ```
   You should see the two employees we just added

5. Exit the PostgreSQL prompt:
   ```sql
   \q
   ```

## 2. Basic Raw SQL Connection (10 min)

### 2.1 Install PostgreSQL Client

```bash
npm install pg
npm install --save-dev @types/pg
```

### 2.2 Simple Query Example

Update your `app.ts` with this basic database connection:

```typescript
import express from "express";
import employeeRouter from "./employee_router";
import bodyparser from "body-parser";
import loggerMiddleware from "./loggerMiddleware";
const { Client } = require('pg');

const server = express();
server.use(bodyparser.json());
server.use(loggerMiddleware);

server.use("/employee", employeeRouter);

server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello world typescript");
});

// Database connection configuration
const dbConfig = {
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: '5432',
  database: 'training',
};

// Create a new PostgreSQL client
const client = new Client(dbConfig);

// Connect to the database
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    // Execute SQL queries here
    client.query('SELECT * FROM employee', (err, result) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        console.log('Query result:', result.rows);
      }

      // Close the connection when done
      client.end()
        .then(() => {
          console.log('Connection to PostgreSQL closed');
        })
        .catch((err) => {
          console.error('Error closing connection', err);
        });
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

server.listen(3000, () => {
  console.log("server listening to 3000");
});
```

This code will:
1. Connect to the PostgreSQL database
2. Run a simple SELECT query
3. Log the results to console
4. Close the connection

### 2.3 SQL Injection Example

Now, let's see how SQL injection can happen with unsafe queries:

```typescript
// UNSAFE: Vulnerable to SQL injection
const unsafeQuery = (email: string) => {
  return client.query(`SELECT * FROM employee WHERE email = '${email}'`);
};

// This could be user input!
const userInput = "admin'; DROP TABLE employee; --";

// The query becomes:
// SELECT * FROM employee WHERE email = 'admin'; DROP TABLE employee; --'
```

### 2.4 Why Not Raw SQL?

1. **No Type Safety**:
   - Loose connection between DB schema and TypeScript types
   - Easy to make mistakes in queries

2. **Security Risks**:
   - Manual SQL injection protection needed
   - Easy to forget parameterization

3. **No Migrations**:
   - Manual schema changes
   - Hard to track and share DB changes

TypeORM solves these issues and more - let's see how!

## 3. TypeORM Setup (20 min)

### 3.1 Install Dependencies

```bash
npm install typeorm reflect-metadata typeorm-naming-strategies
npm install --save-dev @types/pg
```

**Key Dependencies Explained:**
- `typeorm`: The core ORM library for TypeScript/JavaScript
- `reflect-metadata`: Required for TypeORM's decorator-based syntax
- `typeorm-naming-strategies`: Provides naming strategies for database columns/tables
- `@types/pg`: TypeScript type definitions for PostgreSQL (dev dependency)

### 3.2 Configure TypeScript

Update your `tsconfig.json` to enable decorator support and metadata emission:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "dist",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

**Why These Settings Matter:**
- `experimentalDecorators`: Enables TypeScript's support for decorators (`@Entity()`, `@Column()`, etc.)
- `emitDecoratorMetadata`: Allows TypeORM to access TypeScript type information at runtime

### 3.3 Create Employee Entity

**Entities** are TypeScript classes that map to database tables. They define both the schema and the data model.

Create `src/entity/employee.entity.ts`:

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Employee;
```

**Decorators Explained:**
- `@Entity()`: Marks the class as a database entity
- `@Column()`: Defines a database column
- `@PrimaryGeneratedColumn()`: Auto-incrementing primary key
- `@CreateDateColumn`/`@UpdateDateColumn`: Special columns for tracking timestamps

### 3.4 Create Data Source

**What is a DataSource?**
The DataSource is TypeORM's entry point for database connections. It manages connection pooling, configuration, and entity registration.

Create `data-source.ts` in your project root:

```typescript
import "reflect-metadata";  // Must be imported first
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import Employee from "./employee.entity";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "training",
  username: "postgres",
  password: "postgres",
  extra: { max: 5, min: 2 }, // Connection pool settings
  synchronize: true,          // Auto-creates database schema
  logging: true,              // Logs SQL queries
  namingStrategy: new SnakeNamingStrategy(), // Converts camelCase to snake_case
  entities: [Employee],        // Register your entities here
});

export default dataSource;
```

**Key Configuration Points:**
- `synchronize: true`: Automatically creates/updates database tables (disable in production)
- `logging: true`: Helpful for debugging SQL queries
- `namingStrategy`: Ensures consistent naming between JavaScript (camelCase) and SQL (snake_case)

### 3.5 Update app.ts

This is where we connect our Express app to the database:

```typescript
import express from "express";
import employeeRouter from "./employee_router";
import bodyparser from "body-parser";
import loggerMiddleware from "./loggerMiddleware";
import dataSource from "./data-source";

const server = express();
server.use(bodyparser.json());
server.use(loggerMiddleware);

server.use("/employee", employeeRouter);

server.get("/", (req, res) => {
  res.status(200).send("Hello world typescript");
});

// Initialize database connection and start server
(async () => {
  try {
    await dataSource.initialize();  // Connect to database
    console.log('Database connected');
  } catch (e) {
    console.error("Failed to connect to db", e);
    process.exit(1);
  }

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
})();
```

**Key Points:**
- `dataSource.initialize()`: Establishes database connection
- The async IIFE ensures database is connected before starting the server
- Error handling prevents the app from starting if database connection fails

### 3.6 Test the Connection

1. Start the server:
   ```bash
   npm run start-server
   ```

2. Check the logs for:
   - Successful database connection message
   - SQL logs showing table creation (due to `synchronize: true`)
   - Server start confirmation

### 3.7 Verify the Table

Connect to your database and verify the table structure:

```bash
docker exec -it postgres-db psql -U postgres -d training
\d employee
```

You should see the `employee` table with columns matching your entity definition, plus any system columns TypeORM adds.

## 4. Implementing the Repository and Basic Read Operations (30 min)

Now that we have our database connection and entity set up, let's implement the repository pattern and basic read operations for our Employee entity.

### 4.1 Update the Employee Router

We'll modify our existing router to use TypeORM's repository pattern. For this session, we'll focus on implementing the GET endpoints:

```typescript
import express from "express";
import Employee from "./employee.entity";
import dataSource from "./data-source";

const employeeRouter = express.Router();

// Get all employees
employeeRouter.get("/", async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employees = await employeeRepository.find();
  res.status(200).send(employees);
});

export default employeeRouter;
```

### 4.2 Key Concepts

1. **Repository Pattern**: 
   - Each entity has its own repository that handles all database operations
   - We access the repository using `dataSource.getRepository(Employee)`

2. **Basic Read Operation**:
   - `getRepository(Employee).find()` - Retrieves all employees

### 4.3 Testing the API

You can test the GET endpoints using curl or Postman:

1. **Get All Employees**
   ```bash
   curl http://localhost:3000/employee
   ```

In the next session, we'll implement the remaining CRUD operations (Create, Update, Delete) and add more advanced features like input validation and error handling.
