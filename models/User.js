import {DataTypes} from "sequelize";
import db from "../config/db.js";

import bcrypt from "bcrypt";

const User = db.define('users', {
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
},{
    hooks:{
        beforeCreate: async function(user){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

// Custom method to compare passwords
User.prototype.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default User;