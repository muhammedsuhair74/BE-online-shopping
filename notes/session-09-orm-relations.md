# Session 9: ORM Relations

### Add Address Entity

Discuss on how to add Address to Employee.

Since address would require multiple fields, instead of creating another column for address, let's go ahead by creating an entity.

1. Create Address entity 
```
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  line1: string;

  @Column()
  pincode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default Address;
```

2. On comparing the Employee and Address entities, many columns are in common. In this case we can use inheritance property of class.

Create an entity - `AbstractEntity`

```
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export default AbstractEntity;
```

3. Update Employee entity to extend AbstractEntity
```
import { Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity";

@Entity()
class Employee extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;
}

export default Employee;

```

4. Update Address entity to extend AbstractEntity
```
import { Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity";

@Entity()
class Address extends AbstractEntity {
  @Column()
  line1: string;

  @Column()
  pincode: string;
}

export default Address;
```
5. Run migration

`npm run migration:generate db/migrations/create-address`

Note to trainer/moderators:

*1. No migration file would be generated and in the logs we can see `No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command`.*

*Reason: Address is not added to entities in the dataSource*

6. Add Address entity to the entities section.
```
const dataSource = new DataSource({
  .
  .
  .
  entities: [Employee, Address],
  migrations: ["dist/db/migrations/*.js"],
});
```

7. But the problem with this approach is, each time a new entity is added, entities should be updated with it.

Update entities as

`entities: ["dist/entities/*.js"]`

# ORM Relations

Employee and Address entity are not connected yet.

The link between the entities can be done using ORM relations 

Documentation: https://typeorm.io/relations

## One-to-one Relations

One-to-one is a relation where A contains only one instance of B, and B contains only one instance of A.

Update Employee and Address entity by specifying one-to-one relation.

**Employee**:
```
import { Column, Entity, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Address from "./address.entity";

@Entity()
class Employee extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @OneToOne(() => Address, (address) => address.employee, {
   cascade: true
  })
  address: Address
}

export default Employee;
```
**Address**
```
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Employee from "./employee.entity";

@Entity()
class Address extends AbstractEntity {
  @Column()
  line1: string;

  @Column()
  pincode: string;

  @OneToOne(() => Employee, (employee) => employee.address, {
     onDelete: 'CASCADE'
  })
  @JoinColumn()
  employee: Employee;
}

export default Address;
```
Now, generate a migration to reflect the changes: `npm run migration:generate db/migrations/add-one-to-one-relation-between-employee-and-address`

Run the migration: `npm run migration:run`

#### API updations

#### 1. Create an employee with address info

**Employee Controller**

createEmployee - POST /employee
```
public createEmployee = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { email, name, address } = req.body;
    const savedEmployee = await this.employeeService.createEmployee(
      email,
      name,
      address
    );
    res.status(200).send(savedEmployee);
  };
```

**Employee Service**

createEmployee
```
  async createEmployee(email: string, name: string, address: Address): Promise<Employee> {
    const newAddress = new Address();
    newAddress.line1 = address.line1;
    newAddress.pincode = address.pincode;

    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;
    newEmployee.address = newAddress;

    return this.employeeRepository.create(newEmployee);
  }

```

#### 2. Find employees - GET /employee

**Employee repository**

findMany
```
async findMany(): Promise<Employee[]> {
    return this.repository.find({
      relations: {
        address: true,
      },
    });
  }
```

#### 3. Find employee by id - GET /employee/:id

**Employee repository**

findOneById
```
async findOneById(id: number): Promise<Employee | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        address: true,
      },
    });
  }
```

#### 4. Delete employee

Since, the relation is defined as `onDelete: "CASCADE"`, ideally on deleting the employee, address also needs to be deleted.

Invoke DELETE /employee/:id - what's the output?

Employee got deleted, but address still remains in the table? Why is it so?

The issue is likely with the `delete` method in the repository. Using `repository.delete()` directly won't trigger the cascade delete. Instead, we should use `repository.remove()` which will properly handle the cascade relationships. 

But `repository.remove()` would delete the data permanently from the db. If there are cases when the deleted entry should be retained in the db for future references, we can use `repository.softRemove()`

**Employee service**

deleteEmployee
```
async deleteEmployee(id: number): Promise<void> {
    const employee = await this.employeeRepository.findOneById(id);
    if (employee) {
      await this.employeeRepository.softRemove(employee);
    }
  }
```

**Employee repository**

softRemove

```
async softRemove(employee: Employee): Promise<void> {
    await this.repository.softRemove(employee);
  };
```

## Many-to-one Relations

Many-to-one / one-to-many is a relation where A contains multiple instances of B, but B contains only one instance of A.

Explain with the documentation

Connect it to the employee-department example

Leave it as an assignment

