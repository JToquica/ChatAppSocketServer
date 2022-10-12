const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../schemas/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email: email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya está registrado"
            });
        } 

        const usuario = new Usuario(req.body);
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password,salt);
        
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        });
    }

    
};

const login = async(req, res = response) => {

    const {email , password} = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Email no encontrado"
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "La contraseña no es valida"
            });
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        });
    }

}


const renewToken = async(req, res = response) => {

    const usuario = await Usuario.findById(req.uid)

    if (!usuario) {
        return res.status(404).json({
            ok: false,
            msg: "Usuario no encontrado"
        });
    }

    const token = await generarJWT(usuario.id);

    res.status(200).json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}