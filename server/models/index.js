const path = require('path')
const Sequelize = require('sequelize')
const database = require('config').database

const sequelize = new Sequelize(database.dbName, database.dbUser, database.dbPassword, {
    define: {
        freezeTableName: true
    },
    host: database.dbHost || 'localhost',
    port: database.dbPort,
    logging: database.logging,
    dialect: database.dialect
})

sequelize.sync({
    force: false
})
.then(() => {
    console.log("SYNC DB SUCCESS")
})
.catch(err => {
    console.log("SYNC DB FAIL", err)
})

let models = ['User', 'Image', 'Project', 'User', 'UserImage']
models.forEach(model => {
    module.exports[model] = require(path.join(__dirname, model))(sequelize, Sequelize.DataTypes)
})


let associate = function(models) {
    models.User.hasMany(models.Image, {
            foreignKey: {
                name: 'idUser',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Image.belongsTo(models.User, {
            foreignKey: {
                name: 'idUser',
                allowNull: false
            }
        });
        models.User.belongsToMany(models.Image, {
            through: {
                model: models.UserImage
            },
            foreignKey: 'idUser'
        });
    
        models.User.hasMany(models.Project, {
            foreignKey: {
                name: 'idUser',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
        models.Project.belongsTo(models.User, {
            foreignKey: {
                name: 'idUser',
                allowNull: false
            }
        })
}   
associate(module.exports)
module.exports.sequelize = sequelize