# Session 10: Data Validation and DTO 

## Trainer Notes

This session introduces data validation concepts and error handling. Use these notes to guide your training session.

### Session Objectives
- Understand the importance of data validation
- Implement basic validation for email fields
- Learn proper error handling approaches
- Introduce the concept of DTOs (Data Transfer Objects)

### Teaching Flow

1. **Introduction (10 mins)**
   - Remind students that they've created employee endpoints
   - Ask: "What happens if someone sends invalid data to our API?"
   - Highlight how validation protects application integrity

2. **Validation Concepts (15 mins)**
   - Explain validation layers:
     - Client-side (UX improvement, not security)
     - Controller level (main API validation)
     - Service level (business rule validation)
     - Database level (last line of defense)
   - Emphasize: "Validation is not just about correctness but security"
   - Why entity validation is needed:
     - **Data Integrity**: Ensures data in the database follows expected formats (e.g., email fields contain valid emails)
     - **Database Consistency**: Prevents inconsistent data, especially important for relational databases with foreign keys
     - **Security**: Protects against vulnerabilities like SQL injection or data corruption
     - **Better Error Handling**: Provides meaningful error messages to users
     - **Data Consistency Across Layers**: Maintains consistency across application layers (frontend, backend, database)
     - **Code Maintainability**: Centralizes validation logic for easier maintenance

3. **Hands-on Exercise: Custom Email Validation (15 mins)**
   - Have students create a validators folder with a simple email validator function
   - Implement a basic function to check for @ in email
   ```ts
   // src/validators/email.validator.ts
   export function isValidEmail(email: string): boolean {
     return email.includes('@');
   }
   ```
   - Discuss limitations of this simple approach
   - Challenge: Ask them to improve this validation with a more robust regex pattern
   - Show how to use this in a controller:
   ```ts
   import { isValidEmail } from '../validators/email.validator';
   
   // Inside controller method
   if (!isValidEmail(req.body.email)) {
     return res.status(400).json({ error: 'Invalid email format' });
   }
   ```

4. **Error Handling Exercise (25 mins)**
   - Go to employee controller
   - Have students console.log errors when no employee is found
   - Ask them to implement the below code:

```ts
const employeeId = Number(req.params.id);
const employee = await this.employeeService.getEmployeeById(employeeId);
if (!employee) {
    const error = new Error(`No employee found with id: ${req.params.id}`);
    throw error;
}
res.status(200).send(employee);
```

5. **Discussion: What Happened? (15 mins)**
   - The server crashed! Why?
   - Key learning: Uncaught exceptions crash Node.js servers
   - Explain that this is not good for application uptime
   - Introduce express error handling with next()
   - Have students modify the code:

```ts
// Add import at the top of the file
import { NextFunction } from "express";

// Update function signature and implementation
public getEmployeeById = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
) => {
    try {
        const employeeId = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeById(employeeId);
        if (!employee) {
            const error = new Error(`No employee found with id: ${req.params.id}`);
            throw error;
        }
        res.status(200).send(employee);
    } catch (error) {
        next(error);
    }
};
```

6. **Custom Error Handling (20 mins)**
   - Discuss REST principles and why default error handling isn't sufficient:
     - Status code is always 500
     - Response format isn't consistent with our API standard JSON format
   - Implement a custom error handler in app.ts:

```ts
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});
```

   - Point out we still have the 500 status issue
   - Create a custom HttpException class:

```shell
mkdir src/exception
touch src/exception/http.exception.ts
```

```ts
/**
* Base http exception class.
*/
class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export default HttpException;
```

   - Update the error middleware in app.ts:

```ts
server.use((err: Error, req, res, next) => {
    console.error(err.stack);
    if (err instanceof HttpException) {
        res.status(err.status).send({ error: err.message, code: err.errorCode });
        return;
    }
    res.status(500).send({ error: err.message });
```

   - Move error handling to a dedicated middleware:

```shell
touch src/middleware/error.middleware.ts
```

```ts
import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/HttpException";

const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (error instanceof HttpException) {
            const status: number = error.status || 500;
            const message: string = error.message || "Something went wrong";
            let respbody = { message: message };
            res.status(status).json(respbody);
        } else {
            console.error(error.stack);
            res.status(500).send({ error: error.message });
        }
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
```

7. **Data Transfer Objects (DTOs) (30 mins)**
   - Define: "Data Transfer Objects are objects that carry data between processes"
   - Benefits: Type safety, validation, documentation
   - Install validation libraries:

```shell
npm i class-validator
npm i class-transformer
```

   - Explain these libraries:
     - **class-transformer**: Transforms JSON objects to class instances and vice versa
     - **class-validator**: Uses decorators to validate class instances
   
   - Create an AddressDto:

```ts
import { IsNotEmpty, IsString } from "class-validator";

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  line1: string;

  @IsNotEmpty()
  @IsString()
  pincode: number;
}
```

   - Create/update EmployeeDto:

```ts
import { IsString, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";
import { CreateAddressDto } from "./address.dto";

// Add decorators to properties
@Column()
@IsNotEmpty()
@IsEmail()
email: string;

@Column()
@IsNotEmpty()
@IsString()
name: string;

@ValidateNested({ each: true })
@Type(() => CreateAddressDto)
@IsNotEmpty()
address: CreateAddressDto;
```

   - Implement DTO validation in the controller:

```ts
// Transform request body to DTO instance
const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);

// Validate the DTO
const errors = await validate(createEmployeeDto);

// Handle validation errors
if (errors.length > 0) {
    console.log(JSON.stringify(errors));
    throw new HttpException(400, JSON.stringify(errors));
}

// Use validated DTO fields
const savedEmployee = await this.employeeService.createEmployee(
    createEmployeeDto.email,
    createEmployeeDto.name,
    createEmployeeDto.address
);
```

### Common Student Questions
- "Why not just use database constraints for validation?"
- "Is client-side validation enough?"
- "Why do we need DTOs if we have TypeScript interfaces?"
- "What's the difference between validation at controller vs. service layer?"
- "How do we handle validation for complex nested objects?"

### Wrap-up
- Recap key concepts
- Assign homework: Implement complete validation for all employee fields
- Preview next session: Advanced error handling and custom exceptions

**Note**: Feel free to adjust timing based on student comprehension. The email validation exercise can be expanded if students grasp concepts quickly.

