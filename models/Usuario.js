import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from'../config/db.js';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado:  DataTypes.BOOLEAN
},
{
    hooks:{
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            console.log('Usuario antes del hash:', usuario);
            console.log('Salt:', salt);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
});

export default Usuario;