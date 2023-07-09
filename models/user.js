const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            /*town:{
                type: Sequelize.TEXT,
                allowNull: false
            },
            animal:{
                type: Sequelize.TEXT,
                allowNull: false
            }*/
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
};
