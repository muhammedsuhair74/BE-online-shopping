# Session 8: Migrations

## 1. What is migrations?
Migrations are like version control for your database. They help you track, manage and apply changes to your database schema over time.

## 2. Why do we need migrations?

1. **Track Database Changes**: Just like Git tracks changes in code, migrations track changes in your database structure
2. **Team Collaboration**: Multiple developers can work on the database schema and stay in sync
3. **Version History**: You can roll back changes if something goes wrong
4. **Consistent Environments**: Ensures development, staging and production databases have the same structure

## 3. When do we need a Migration?

- Add a new table
- Add/remove columns
- Change column types
- Add indexes or constraints

Instead of manually making these changes, you write a migration file that can:
- Apply the changes (`up` migration)
- Reverse the changes (`down` migration)

## 4. How to do migrations in typeorm?

Documentation: https://typeorm.io/migrations

#### Create a migration
Creates a blank migration file. Used when you want to write the migration manually.

Eg: Create employee table

1. Create a folder `migrations` inside the `db`
2. Add below in datasource definition. File path -> `/db/data-source.ts`

`migrations: ["dist/db/migrations/*.js"]`

3. Create a migration file

`npx typeorm migration:create db/migrations/create-employee`

4. In the `up()`, add

`await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);`

4. In the `down()`, add:

`await queryRunner.query(`DROP TABLE "employee"`);`

5. Build the project
6. Run the migration

`npx typeorm migration:run -d dist/db/data-source.js`

Note to the trainer/moderators:

*1. Make sure that the docker is up and postgres is connected.*

*2. Running the create-employee migration at first could result in error `QueryFailedError: relation "employee" already exists` since the employee table would be already created manually in the previous typeorm session. Ask the trainees to drop the table from db and re-run the above command.*


#### Revert the migration

Eg: Drop the employee table

`npx typeorm migration:revert -d dist/db/data-source.js`

#### Generate a migration
Creates a migration based on entity changes. Used when you've changed your entities and want TypeORM to generate SQL for you.

`npx typeorm migration:generate -d dist/db/data-source.js db/migrations/create-employee`

Note to the trainer/moderators:

*1. Running this command would result in `error: relation "employee" already exists`, since previous migration file is present. Ask the trainees to delete the migration file and re-run the command.
This might also result in error, this is because the deleted file is still present in the /dist folder.*

*Reason: TypeScript's tsc compiler only handles compilation of .ts files to .js files - it doesn't automatically clean up or remove files in the output directory (dist) that no longer exist in the source.*

*Solution: Delete dist and do `npm run build`.*

*Better approach: Update build script in package.json to `"build": "rm -rf dist && npx tsc"`*

## How do we usually do?
Add as scripts to package.json

```
"migration:create": "npm run build && npx typeorm migration:create",
"migration:generate": "npm run build && npx typeorm migration:generate -d dist/db/data-source.js",
"migration:run": "npm run build && npx typeorm migration:run -d dist/db/data-source.js",
"migration:revert": "npm run build && npx typeorm migration:revert -d dist/db/data-source.js"
```

Using scripts, add age field to employee
```
@Entity()
class Employee {
  @PrimaryGeneratedColumn()
  id: number;
    .
    .  
    .
  @Column()
  age: number;
}
```
To generate migration file:

`npm run migration:generate db/migrations/add-age-to-employee`

Run the migration: `npm run migration:run`


Note to the trainer/moderators:

*1. If there are existing employee records in db, it can result in error saying age cannot be null. In that case, try out by deleting existing entites and re-run the migration.*

*2. Point out to them that in the real-world*, 
- *Use a default temporarily*
- *Make it nullable first, then backfill and change to not null*
