import {MigrationInterface, QueryRunner} from "typeorm";

export class removingSnakeCaseFromAllFiles1643583138414 implements MigrationInterface {
    name = 'removingSnakeCaseFromAllFiles1643583138414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`contact_phone\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`document_number\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`open_time\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`close_time\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`contactPhone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`documentNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`openTime\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`closeTime\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`closeTime\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`openTime\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`documentNumber\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`contactPhone\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`close_time\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`open_time\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`document_number\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`contact_phone\` varchar(255) NOT NULL`);
    }

}
