module.exports = function(sequelize, DataTypes) {
    const BmiData = sequelize.define("BmiData", {
        // weight = integer
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        // bmi Value = integer
        bmiValue: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        // bmi Status = string
        bmiStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        // bmi Risk = string
        bmiRisk: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        // ideal weight = string
        idealWeight: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        // waist to height ratio = string; we can allow this column value to be null, as the API will not return a value if the "waist" input on the form is left blank (optional)
        whtr: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
    BmiData.associate = function(models) {
        BmiData.belongsTo(models.User, {
            foreignKey: {
                allowNull:false
            }
        });
    };
    return BmiData;
}