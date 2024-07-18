const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

// Crear uno o más usuarios
const crearUsuario = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) return res.status(400).send({ msg: "El nombre es obligatorio" });
  if (!email) return res.status(400).send({ msg: "El correo es obligatorio" });
  if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

  const usuario = new Usuario({
    name,
    email: email.toLowerCase(),
    role: "Usuario",
    active: false,
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  usuario.password = hashPassword;

  try {
    const userStorage = await usuario.save();
    res.status(200).send(userStorage);
  } catch (error) {
    res.status(400).send("Error al crear el usuario");
  }
};

// Actualizar un usuario por ID
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// Eliminar un usuario por ID
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
