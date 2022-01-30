import {MigrationInterface, QueryRunner} from "typeorm";

export class renamingOpenAndCloseTime1643500664013 implements MigrationInterface {
    name = 'renamingOpenAndCloseTime1643500664013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`opens_from\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`opens_until\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`open_time\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`close_time\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`close_time\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` DROP COLUMN \`open_time\``);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`opens_until\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pharmacy\` ADD \`opens_from\` varchar(255) NOT NULL`);
    }

}
