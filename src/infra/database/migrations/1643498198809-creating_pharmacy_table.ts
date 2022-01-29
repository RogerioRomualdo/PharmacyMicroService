import {MigrationInterface, QueryRunner} from "typeorm";

export class creatingPharmacyTable1643498198809 implements MigrationInterface {
    name = 'creatingPharmacyTable1643498198809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pharmacy\` (\`id\` varchar(36) NOT NULL, \`logo\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`contact_phone\` varchar(255) NOT NULL, \`document_number\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`opens_from\` varchar(255) NOT NULL, \`opens_until\` varchar(255) NOT NULL, \`isSubsidiaryOfId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD CONSTRAINT \`FK_bf3f6cb8ada66468c4829b01cc3\` FOREIGN KEY (\`isSubsidiaryOfId\`) REFERENCES \`pharmacy\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP FOREIGN KEY \`FK_bf3f6cb8ada66468c4829b01cc3\``);
        await queryRunner.query(`DROP TABLE \`pharmacy\``);
    }

}
