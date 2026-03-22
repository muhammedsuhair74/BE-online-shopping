### Authentication

- Process of verifying who a user is.
- Verifies the user's identity.
- Often involves a password.

### Authorization

- Process of verifying what a user has access to.
- Verifies the user's permissions.
- Often involves a role or a group.

## Authentication

#### Add password field

Add password field to user model `entities/employee.entity.ts`

```diff
diff --git entities/employee.entity.ts entities/employee.entity.ts
@@ -21,0 +21,3 @@

  address: Address;
+
+  @Column()
+  password: string;
```

#### Generate & run migration

```bash
npm run migration:generate db/migrations/add-password-field-to-employee-table
npm run migration:run
```

Error will be thrown:

> column "password" of relation "employee" contains null values

To fix this, we need to add password to existing users:

- Make password field nullable.
- Add default value to password field.
- Make password field not nullable.

```ts
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "password" character varying`,
    );
    await queryRunner.query(
      `UPDATE "employee" SET "password" = 'password' WHERE "password" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "password" SET NOT NULL`,
    );
  }
```

Run migration again:

```bash
npm run migration:run
```

### Update dtos and services

Update `create-employee.dto.ts` to include password field:

```ts
  @IsNotEmpty()
  @IsString()
  password: string;
```

Update `employee.service.ts` to include password field:

```diff
diff --git services/employee.service.ts services/employee.service.ts
@@ -9,1 +9,1 @@
-  async createEmployee(email: string, name: string, age: number, address: CreateAddressDto): Promise<Employee> {
+  async createEmployee(email: string, name: string, age: number, address: CreateAddressDto, password: string): Promise<Employee> {
```

```diff
diff --git services/employee.service.ts services/employee.service.ts
@@ -19,0 +19,1 @@
    newEmployee.name = name;
    newEmployee.age = age;
    newEmployee.address = newAddress;
+   newEmployee.password = password;
```

Update `employee.controller.ts` to include password field:

```diff
diff --git controllers/employee.controller.ts controllers/employee.controller.ts
@@ -32,0 +32,1 @@
+   createEmployeeDto.password
);
```

> Storing password in plain text is not secure. We will use bcrypt to hash the password.

### Bcrypt

Bcrypt is a password hashing function that is used to hash the password before storing it in the database.

Install `bcrypt` package:

```bash
npm install bcrypt @types/bcrypt
```

Update `employee.service.ts` to include bcrypt:

```diff
diff --git services/employee.service.ts services/employee.service.ts
@@ -20,1 +20,1 @@
-   newEmployee.password = password;
+   newEmployee.password = await bcrypt.hash(password, 10);
```

Note: `10` is the salt rounds. Bcrypt generates a random salt for each password, more complex depending on the number of rounds. The higher the number, the more secure the password, but slower the hashing.

### Login

#### Add auth controller, service and dto

Update `repositories/employee.repository.ts` to include `findOneByEmail` method:

```ts
  async findOneByEmail(email: string): Promise<Employee | null> {
    return this.repository.findOne({
      where: { email },
      relations: {
        address: true,
      },
    });
  }
```

Update `services/employee.service.ts` to include `getEmployeeByEmail` method:

```ts
  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepository.findOneByEmail(email);
  }
```

Create `services/auth.service.ts`:

```ts
import HttpException from "../exception/http.exception";
import EmployeeService from "./employee.service";
import * as bcrypt from "bcrypt";

class AuthService {
  constructor(private employeeService: EmployeeService) {}

  async login(email: string, password: string) {
    const employee = await this.employeeService.getEmployeeByEmail(email);
    if (!employee) {
      throw new HttpException(400, "Employee not found");
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }

    return employee;
  }
}

export default AuthService;
```

Create `controllers/auth.controller.ts`:

```ts
import AuthService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import express from "express";
import HttpException from "../exception/http.exception";

class AuthController {
  router: express.Router;

  constructor(private authService: AuthService) {
    this.router = express.Router();
    this.router.post("/login", this.login);
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HttpException(400, "Email and password are required");
      }
      const employee = await this.authService.login(email, password);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
```

Create `routes/auth.routes.ts`:

```ts
import AuthService from "../services/auth.service";
import EmployeeService from "../services/employee.service";
import AuthController from "../controllers/auth.controller";
import dataSource from "../db/data-source";
import Employee from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";

const employeeRepository = new EmployeeRepository(
  dataSource.getRepository(Employee)
);
const employeeService = new EmployeeService(employeeRepository);
const authService = new AuthService(employeeService);
const authController = new AuthController(authService);
const authRouter = authController.router;

export default authRouter;
```

Update `app.ts` to include auth routes:

```ts
server.use("/auth", authRouter);
```

> The user is logged in but the state is not being maintained.

### JWT

JWT is a way to maintain a user's login state.

Install `jsonwebtoken` package:

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

Instead of returning the user object, we will return a JWT token.
This token will contain the user's id and email so that we can identify the user later.

- JWT is a standard way to encode and decode tokens.
- It uses a secret key to encode and decode the token - Symmetric encryption.
- Mention asymmetric encryption: Public and private keys.

Create `utils/constants.ts`:

```ts
export const JWT_SECRET = "secret";
export const JWT_VALIDITY = "1h";
```

> Mention that these values should be stored in environment variables.

### Modify login service

Add `dto/jwt-payload.dto.ts`:

```ts
export class JwtPayload {
  id: number;
  email: string;
}
```

Update `services/auth.service.ts` to include JWT token generation:

```ts
const jwtPayload: JwtPayload = {
  id: employee.id,
  email: employee.email,
};
const token = jwt.sign(jwtPayload, JWT_SECRET, {
  expiresIn: JWT_VALIDITY,
});
```

Briefly explain the parts of the token:

- Header: Contains the algorithm used to encode the token.
- Payload: Contains the user's id and email.
- Signature: A hash of the header and payload.

> Mention that the token is not encrypted, it is Base64 encoded, and should not contain sensitive information.

### JWT Authentication

Token is sent in the `Authorization` header, as per the HTTP specification.

The token should be prefixed with `Bearer `.

Instead of repeating the token in every request, we will use a middleware to verify the token.

#### Middleware

Create `middlewares/authenticationMiddleware.ts`:

```ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constants";
import { JwtPayload } from "../dto/jwt-payload.dto";
import HttpException from "../exception/http.exception";

const getToken = (req: Request): string | undefined => {
  const token = req.headers.authorization;
  if (!token) {
    return undefined;
  }
  return token.replace("Bearer ", "");
};

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = getToken(req);
  if (!token) {
    throw new HttpException(401, "Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new HttpException(401, "Unauthorized");
  }
};

export default authenticationMiddleware;
```

If `@types/express` is installed, this might give error: `req.user is not defined`.

To fix this, we need to declare the `user` property in the `Request` interface.

```ts
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
```

We are telling the compiler to add user property to our Request definition.

### Middleware

We need some endpoints to be open, like the login endpoint.

Add authentication middleware to only the routes that need to be protected:

In `app.ts`, update the employee router to include the authentication middleware:

```ts
server.use("/employees", authenticationMiddleware, employeeRouter);
```

## Authorization: Role-based access control (RBAC)

RBAC is a way to control access to resources based on the user's role.

### Add roles to employee

Add `role` field to employee model `entities/employee.entity.ts`:

```ts
export enum EmployeeRole {
  UI = "UI",
  UX = "UX",
  DEVELOPER = "Developer",
  HR = "HR",
}
```

Add `role` field to employee model `entities/employee.entity.ts`:

```ts
  @Column({
    type: "enum",
    enum: EmployeeRole,
    default: EmployeeRole.DEVELOPER,
  })
  role: EmployeeRole;
```

Run migration:

```bash
npm run migration:generate db/migrations/add-role-field-to-employee-table
npm run migration:run
```

### Update DTO, service and controller

Update `create-employee.dto.ts` to include `role` field:

```ts
import { EmployeeRole } from "../entities/employee.entity";

export class CreateEmployeeDto {
  ...

  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role: EmployeeRole;
}
```

Update `employee.service.ts` to include `role` field:

```ts
  async createEmployee(
    email: string,
    name: string,
    age: number,
    address: CreateAddressDto,
    password: string,
    role: EmployeeRole
  ): Promise<Employee> {
    ...
    newEmployee.role = role;
    ...
  }
```

Update `employee.controller.ts` to include `role` field:

```diff
diff --git controllers/employee.controller.ts controllers/employee.controller.ts
@@ -3,0 +34,1 @@
    createEmployeeDto.password,
+   createEmployeeDto.role
);
```

> Run the app and check the database to see the new role field.

### Include role in JWT payload

Update `dto/jwt-payload.dto.ts` to include `role` field:

```ts
import { EmployeeRole } from "../entities/employee.entity";

export class JwtPayload {
  id: number;
  email: string;
  role: EmployeeRole;
}
```

### Update auth service

Update `services/auth.service.ts` to include `role` field:

```diff
diff --git services/auth.service.ts services/auth.service.ts
@@ -25,0 +25,1 @@
   email: employee.email,
+  role: employee.role,
```

### Add authorization to `createEmployee` endpoint

Update `createEmployee` method in `employee.controller.ts` to include authorization:

```ts
try {
  const role = req.user?.role;
  if (role !== EmployeeRole.HR) {
    throw new HttpException(403, "Forbidden");
  }
  ...
}
```

Again, instead of repeating the role check in every endpoint, we will use a middleware.

Create `middlewares/authorizationMiddleware.ts`:

```ts
import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";
import { EmployeeRole } from "../entities/employee.entity";

const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;
  if (role !== EmployeeRole.HR) {
    throw new HttpException(403, "Forbidden");
  }
  next();
};

export default authorizationMiddleware;
```

Update `employee.controller.ts` to include authorization middleware for:

- `createEmployee`
- `updateEmployee`
- `deleteEmployee`

We can do this by adding the middleware to the router during the endpoint registration:

```ts
  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();
    this.router.post(
      "/",
      authorizationMiddleware,
      this.createEmployee.bind(this)
    );
    this.router.get("/", this.getAllEmployees.bind(this));
    this.router.get("/:id", this.getEmployeeById.bind(this));
    this.router.put("/:id", authorizationMiddleware, this.updateEmployee);
    this.router.delete("/:id", authorizationMiddleware, this.deleteEmployee);
  }
```

Remove the role check from the controller methods.

## Exercise 1: Modify the `authenticationMiddleware` to to accept a role

```ts
const checkRole = (role: EmployeeRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (userRole !== role) {
      throw new HttpException(403, "Forbidden");
    }
    next();
  };
};
```

Modify the `employee.controller.ts` to use the `checkRole` middleware.

```ts
  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();
    this.router.post(
      "/",
      checkRole(EmployeeRole.HR),
      this.createEmployee.bind(this)
    );
    this.router.get("/", this.getAllEmployees.bind(this));
    this.router.get("/:id", this.getEmployeeById.bind(this));
    this.router.put("/:id", checkRole(EmployeeRole.HR), this.updateEmployee);
    this.router.delete("/:id", checkRole(EmployeeRole.HR), this.deleteEmployee);
  }
```

## Exercise 2: Modify the `authorizationMiddleware` to accept a list of roles

```ts
export const checkRole = (...roles: EmployeeRole[]) => {
  ...
    if (!roles.includes(userRole)) {
  ...
};

```
