//Usa commo js:  const express = require('express');
import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmar,
  formularioRecuperarPassword,
  resetPassword,
  comprobarToken,
  newPassword,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/register", formularioRegistro);
router.post("/register", registrar);

router.get("/confirmar/:token", confirmar);

router.get("/forgot-password", formularioRecuperarPassword);
router.post("/forgot-password", resetPassword);

// Almacena el nuevo password

router.get("/forgot-password/:token", comprobarToken);
router.post("/forgot-password/:token", newPassword);

export default router;
