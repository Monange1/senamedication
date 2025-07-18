"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.User],
    synchronize: false,
});
async function deleteAllUsers() {
    try {
        await AppDataSource.initialize();
        console.log('Connected to database');
        const userRepository = AppDataSource.getRepository(user_entity_1.User);
        const result = await userRepository.delete({});
        console.log(`Successfully deleted ${result.affected} users`);
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
deleteAllUsers();
//# sourceMappingURL=delete-users.js.map