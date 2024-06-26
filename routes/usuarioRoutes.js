//Usa commo js:  const express = require('express');
import express from "express";
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioRecuperarPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/register",formularioRegistro);
router.post("/register",registrar);

router.get('/confirmar/:token', confirmar);

router.get("/olvide-password",formularioRecuperarPassword);



export default router;
