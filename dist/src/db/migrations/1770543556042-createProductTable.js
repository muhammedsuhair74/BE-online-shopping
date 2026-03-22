export class CreateProductTable1770543556042 {
    name = "CreateProductTable1770543556042";
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "image" character varying NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "product"`);
    }
}
//# sourceMappingURL=1770543556042-createProductTable.js.map