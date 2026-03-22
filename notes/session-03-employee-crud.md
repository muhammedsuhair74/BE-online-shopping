1 : Add a class for Employee Type
2 : Add an Object with some sample data 

```json
let employees: Employee[] = [
  {
    id: 1,
    email: "employee1@gmail.com",
    name: "Employee1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: "employee2@gmail.com",
    name: "Employee2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
```

3: Create Employee Router

```javascript
import express from 'express';

const employeeRouter =  express.Router();

employeeRouter.get('/',(req,res)=>{
    console.log(req.url);
    res.status().send('Get all employeess');
});

export default employeeRouter;
```

4: Add `server.use('/employee', employeeRouter);` in app.ts file
5: TEST localhost:3000/employee
```javascript
**Explain export default and other way to export -> export {employeeRouter} and "import {employeeRouter} from"**

Similarly, add POST, PUT, DELETE, GET BY ID
/:id for GET BY ID, explain, and print request param

```javascript
employeeRouter.get('/',(req,res)=>{
    console.log(req.url);
    res.status(200).json(employees);
});

employeeRouter.get('/:id',(req,res)=>{
    console.log(req.url);
    console.log('Get employee: '+ req.params['id']);
    res.status(200).send();
});

employeeRouter.post('/', (req,res)=>{
    console.log(req.url);
    console.log('create employees');
    res.status(200).send();
});

employeeRouter.delete('/:id', (req,res)=>{
    console.log(req.url);
    console.log('delete employees');
    res.status(200).send();
});

employeeRouter.put('/:id', (req,res)=>{
    console.log(req.url);
    console.log('update employees');
    res.status(200).send();
});
```
## Update Employee Router
```javascript
employeeRouter.get('/',(req,res)=>{
    console.log(req.url);
    res.status(200).json(employees);
});

// Update GET BY ID AND CREATE

let count = 2;

employeeRouter.get('/:id',(req,res)=>{
    console.log(req.url);
    res.status(200).json(employees.find((emp)=> emp.id === Number(req.params['id'])));
});

employeeRouter.post('/', (req,res)=>{
    console.log(req.body);
    const newEmployee = new Employee();
    newEmployee.email = req.body.email;
    newEmployee.name = req.body.name;
    newEmployee.id = ++count;
    employees.push(newEmployee);
    res.status(200).json(newEmployee);
});

// CREATE will have an issue due to body parser
```