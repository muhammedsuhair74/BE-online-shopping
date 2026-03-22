> Pain points:
>
> - Large codebase
> - Hard to understand the codebase
> - Hard to maintain
> - Hard to test
> - Hard to debug

## What is Modularization, and why it is useful?

Modularization is the process of breaking down a large application into smaller, more manageable modules.

- **Separation of concerns**: Each module is a self-contained unit that has a specific purpose and functionality. _Site example from codebase: Data parsing, business logic and data access are done from the same function._
- **Reusability**: Modules can be reused in different parts of the application or even in different applications. _Site example from codebase: Some service functions can be reused. Repetition of code, like `getRepository`, is reduced._
- **Testability**: Modules can be tested independently of each other.
- **Ease of development, understanding, debugging, and maintenance**: Modularization helps to reduce the complexity of the application and makes it easier to maintain and extend. _Site example from codebase: We can split the code into smaller modules and test them independently._

> We will split our application into modules, each with a specific purpose and functionality.

## Architecture

- Architecture is the process of designing the structure of the application.
- It is a blueprint that guides the development process.
- It is selected based on the requirements and the size of the application.

Some examples:

- Layered Architecture
- Clean Architecture
- Microservices Architecture
- Event-Driven Architecture

We will use Layered Architecture in this session.

## Layered Architecture

We are splitting our application into layers:

- **Router**: Defines the routes and the endpoints.
- **Controller**: Handles the incoming requests and returns the responses.
- **Service**: Contains the business logic.
- **Repository**: Contains the data access logic.
- **Entity**: Contains the entity definition.

> Modularize database file into `db` folder.

> Excercise: Modularize the `employee` entity.

## Entity

Create `entity` folder in the root of the project.

Move the `employee.entity.ts` file into the `entity` folder.

Update the import path in the `db/data-source.ts` file.

> Since repository is the one that interacts with the database, let's now modularize the repository.

## Repository

TypeORM is already installed and set-up in the project.

To create a repository, we need to create a `repository` folder in the root of the project.

Create `employee.repository.ts` file in the `repository` folder.

```ts
import { Repository } from "typeorm";
import Employee from "../entities/employee.entity";

class EmployeeRepository {
  constructor(private repository: Repository<Employee>) {}

  async create(employee: Employee): Promise<Employee> {
    return this.repository.save(employee);
  }

  async findMany(): Promise<Employee[]> {
    return this.repository.find();
  }

  async findOneById(id: number): Promise<Employee | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(id: number, employee: Employee): Promise<void> {
    await this.repository.save({ id, ...employee });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export default EmployeeRepository;
```

>

## Service

Create `service` folder in the root of the project.

Create `employee.service.ts` file in the `service` folder.

```ts
import Employee from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.findMany();
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneById(id);
  }

  async createEmployee(email: string, name: string): Promise<Employee> {
    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;
    return this.employeeRepository.create(newEmployee);
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }

  async updateEmployee(id: number, email: string, name: string): Promise<void> {
    const employee = await this.employeeRepository.findOneById(id);
    if (employee) {
      employee.email = email;
      employee.name = name;
      await this.employeeRepository.update(id, employee);
    }
  }
}

export default EmployeeService;
```

## Controllers

Create `controllers` folder in the root of the project.

Create `employee.controller.ts` file in the `controllers` folder.

```ts
import express from "express";
import EmployeeService from "../services/employee.service";

class EmployeeController {
  router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();
    this.router.post("/", this.createEmployee);
    this.router.get("/", this.getAllEmployees);
    this.router.get("/:id", this.getEmployeeById);
    this.router.put("/:id", this.updateEmployee);
    this.router.delete("/:id", this.deleteEmployee);
  }

  public async createEmployee(req: express.Request, res: express.Response) {
    const { email, name } = req.body;
    const savedEmployee = await this.employeeService.createEmployee(
      email,
      name,
    );
    res.status(200).send(savedEmployee);
  }

  public async getAllEmployees(req: express.Request, res: express.Response) {
    const employees = await this.employeeService.getAllEmployees();
    res.status(200).send(employees);
  }

  public async getEmployeeById(req: express.Request, res: express.Response) {
    const employeeId = Number(req.params.id);
    const employee = await this.employeeService.getEmployeeById(employeeId);
    res.status(200).send(employee);
  }

  public async updateEmployee(req: express.Request, res: express.Response) {
    const employeeId = Number(req.params.id);
    const { email, name } = req.body;
    const savedEmployee = await this.employeeService.updateEmployee(
      employeeId,
      email,
      name,
    );
    res.status(200).send(savedEmployee);
  }

  public async deleteEmployee(req: express.Request, res: express.Response) {
    const employeeId = Number(req.params.id);
    await this.employeeService.deleteEmployee(employeeId);
    res.status(200).send();
  }
}

export default EmployeeController;
```

## Router

Create `routes` folder in the root of the project.

Create `employee.routes.ts` file in the `routes` folder.

To create the router, we need the controller.

To create the controller, we need the service.

To create the service, we need the repository.

To create the repository, we need the entity.

```ts
import EmployeeController from "../controllers/employee.controller";
import dataSource from "../db/data-source";
import Employee from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";
import EmployeeService from "../services/employee.service";

const employeeRepository = new EmployeeRepository(
  dataSource.getRepository(Employee),
);
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);
const employeeRouter = employeeController.router;

export default employeeRouter;
```

## App

Now we need to integrate the router into the app.

Modify the `app.ts` file to use the router.

```diff
diff --git app.ts app.ts
@@ -2,4 +2,4 @@
import express from "express";
-import employeeRouter from "./employee_router";
+import employeeRouter from "./routes/employee.routes";
import loggerMiddleware from "./loggerMiddleware";
-import dataSource from "./data-source";
+import dataSource from "./db/data-source";
```

Update the imports in `employee_router.ts` file to run the app.

We will delete this file later. Keep it now for reference.

### Run the app

Run some APIs, including the `employee` API.

We should see error `employeeService is undefined`.

### Fix the error

In `employee.controller.ts` file, when the controller functions are passed to the router, they act as a simple function in the view of the router. The function then lose the context of the controller. Hence `this` is undefined when the function is called.

To fix this, there are two options:

1. Use `bind` to bind the context of the controller to the function.
1. Use arrow functions. Arrow functions keep the context of the controller.

#### Use binding

To use `bind`, update `employee.controller.ts` file:

```diff
diff --git controllers/employee.controller.ts controllers/employee.controller.ts
@@ -9,3 +9,3 @@
 class EmployeeController {
    this.router = express.Router();
-    this.router.post("/", this.createEmployee);
-    this.router.get("/", this.getAllEmployees);
-    this.router.get("/:id", this.getEmployeeById);
+    this.router.post("/", this.createEmployee.bind(this));
+    this.router.get("/", this.getAllEmployees.bind(this));
+    this.router.get("/:id", this.getEmployeeById.bind(this));
    this.router.put("/:id", this.updateEmployee);
```

#### Use arrow functions

Brief arrow functions: It is a concise way to write functions.

- Shorter syntax: `const square => (x: number) => x * x;`
- Lexical `this` binding: Do not have their own `this`; they inherit `this` from their surrounding scope.

To use arrow functions, update `employee.controller.ts` file:

```diff
diff --git controllers/employee.controller.ts controllers/employee.controller.ts
@@ -36,1 +36,1 @@
-   public async updateEmployee(req: express.Request, res: express.Response) {
+   public updateEmployee = async (req: express.Request, res: express.Response) => {
    const employeeId = Number(req.params.id);

@@ -47,1 +47,1 @@
-   public async deleteEmployee(req: express.Request, res: express.Response) {
+   public deleteEmployee = async(req: express.Request, res: express.Response) => {
    const employeeId = Number(req.params.id);
```

### Clean up

Delete file `employee_router.ts`

### Excercise: Modularize middlewares

Create `middlewares` folder and move `loggerMiddleware.ts` and `proccessTimeMiddleware.ts` to it.

Update imports.
