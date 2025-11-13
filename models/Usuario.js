import {DataTypes} from "sequelize";
import db from "../config/db.js";

const Usuario = db.define('usuarios', {
    name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(60),
        allowNull: false
    },
    token:DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
});

export default Usuario;