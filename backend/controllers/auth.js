const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const jwt = require("../utils/jwt");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

  const usuario = new Usuario({
    name,
    email: email.toLowerCase(),
    role: "usuario",
    active: false,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  usuario.password = hashPassword;

  try {
    const userStorage = await usuario.save();
    res.status(200).send(userStorage);
  } catch (error) {
    res.status(400).send({ msg: "Error al crear el usuario" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ msg: "El email es obligatorio" });
  if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

  const emailLowerCase = email.toLowerCase();

  try {
    const userStore = await Usuario.findOne({ email: emailLowerCase });

    if (!userStore) {
      return res.status(400).send({ msg: "El usuario no existe" });
    }

    const check = await bcrypt.compare(password, userStore.password);
    if (!check) {
      return res.status(400).send({ msg: "Contraseña incorrecta" });
    }

    if (!userStore.active) {
      return res.status(401).send({ msg: "Usuario no autorizado o no activo" });
    }

    res.status(200).send({
      access: jwt.createAccessToken(userStore),
      refresh: jwt.createRefreshToken(userStore),
    });
  } catch (error) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

async function refreshAccessToken(req, res) {
  const { token } = req.body;

  if (!token) return res.status(400).send({ msg: "Token requerido" });

  try {
    const decoded = jwt.verifyToken(token); // Aquí ya deberías estar llamando a la función correcta
    if (!decoded) return res.status(400).send({ msg: "Token inválido" });

    const { user_id } = decoded;
    const userStorage = await Usuario.findById(user_id);

    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    res.status(200).send({
      accessToken: jwt.createAccessToken(userStorage),
      refresh: jwt.createRefreshToken(userStorage),
    });
  } catch (error) {
    console.error('Error refreshing access token:', error);
    res.status(500).send({ msg: "Error del servidor" });
  }
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
