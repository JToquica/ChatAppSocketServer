/* Path: api/login  */
const { Router } = require("express");
const router = Router();

const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { crearUsuario, login, renewToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

router.post("/new", [
    check("nombre", "El nombre es obligatorio").not().isEmpty().trim(),
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña debe contener minimo 6 caracteres").isLength({min: 6}),
    validarCampos,
], crearUsuario);

router.post("/", [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña debe contener minimo 6 caracteres").isLength({min: 6}),
    validarCampos,
], login);

// 
router.get("/renew", validarJWT, renewToken);


module.exports = router;