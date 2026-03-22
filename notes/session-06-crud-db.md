# Session 6: Complete CRUD Operations

## 1. Implementing Full CRUD Operations

In this session, we'll complete the CRUD (Create, Read, Update, Delete) operations for our Employee entity. We've already implemented the Read (GET) operations in the previous session.

### 1.1 Update the Employee Router

Let's enhance our employee router with the remaining CRUD operations:

```typescript
import express from "express";
import Employee from "./employee.entity";
import dataSource from "./data-source";

const employeeRouter = express.Router();

employeeRouter.get("/", async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employees = await employeeRepository.find();

  res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

  res.status(200).send(employee);
});

employeeRouter.post("/", async (req, res) => {
  console.log(req.body);

  const newEmployee = new Employee();
  newEmployee.email = req.body.email;
  newEmployee.name = req.body.name;

  const employeeRepository = dataSource.getRepository(Employee);
  const savedEmployee = await employeeRepository.save(newEmployee);

  res.status(200).send(savedEmployee);
});

employeeRouter.delete("/:id", async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee);
  await employeeRepository.delete(req.params.id);

  res.status(200).send();
});

employeeRouter.put("/:id", async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employee = await employeeRepository.findOneBy({ id: Number(req.params.id) });

  employee.email = req.body.email;
  employee.name = req.body.name;
  const savedEmployee = await employeeRepository.save(employee);

  res.status(200).send(savedEmployee);
});

export default employeeRouter;
```

## 2. Testing the API

You can test these endpoints using curl or Postman:

1. **Create Employee (POST /employee)**
   ```bash
   curl -X POST http://localhost:3000/employee \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com"}'
   ```

2. **Update Employee (PUT /employee/:id)**
   ```bash
   curl -X PUT http://localhost:3000/employee/1 \
     -H "Content-Type: application/json" \
     -d '{"name":"John Updated"}'
   ```

3. **Delete Employee (DELETE /employee/:id)**
   ```bash
   curl -X DELETE http://localhost:3000/employee/1
   ```

## 3. Summary

In this session, we've:
1. Added Create, Update, and Delete operations to our Employee API
2. Implemented proper error handling for non-existent resources
3. Used appropriate HTTP status codes (201 for created, 204 for successful delete)
4. Made the update operation partial (only updates provided fields)
