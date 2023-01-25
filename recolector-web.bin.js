#!/usr/bin/env node

const fs = require("fs");
const url = require("url");
const path = require("path");
const yargs = require("yargs").argv;
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const ruta_de_datos = process.cwd() + "/datos";
const PORT = parseInt(yargs.port || 9095);
const app = express();

try { fs.mkdirSync(ruta_de_datos); } catch(error) {}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(function (peticion, respuesta) {
    try {
        const datos = peticion.body;
        const { base, dato, id = false } = datos;
        if (typeof base !== "string") { throw new Error("Se requiere de parámetro «base» (string) en el body de la petición"); }
        if (typeof dato === "undefined") { throw new Error("Se requiere de parámetro «dato» (no undefined) en el body de la petición"); }
        if (base.indexOf("/") !== -1) { throw new Error("Se requiere de parámetro «base» no contener «/»"); }
        const base_sanitizado = base.replace(/[^A-Za-z0-9\.\-\(\)\[\] ]/g, "");
        const base_destino = path.resolve(ruta_de_datos, base_sanitizado + ".json");
        const datos_originales = (function() {
            try {
                const contenido = fs.readFileSync(base_destino).toString();
                return JSON.parse(contenido);
            } catch(error) {
                return { _: [] };
            }
        })();
        if(typeof id === "string") {
            datos_originales[id] = dato;
        } else {
            datos_originales._.push(dato);
        }
        const datos_de_salida = JSON.stringify(datos_originales, null, 2);
        fs.writeFileSync(base_destino, datos_de_salida, "utf8");
        const ruta_rel = base_destino.replace(ruta_de_datos, "");
        console.log("Aceptados datos de: " + ruta_rel + " (id: " + id + ")");
        return respuesta.json({ success: "El dato fue insertado correctamente en: " + ruta_rel });
    } catch (error) {
        console.log(error);
        return respuesta.json({ error: { name: error.name, message: error.message } });
    }
});
app.listen(PORT, function() {
    const ruta_de_servidor = "http://127.0.0.1:" + PORT;
    console.log("[✓] Servidor escuchando en: " + ruta_de_servidor);
    console.log("[✓] Puedes usar el siguiente script para pasarte los datos desde el navegador:");
    console.log("\x1b[32m");
    console.log(`window.enviar_datos = async function(datos) {
    try {
        const respuesta = await window.fetch(${JSON.stringify(ruta_de_servidor)}, {
            method: "POST",
            cors: true,
            body: JSON.stringify(datos),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        });
        const respuesta_en_texto = await respuesta.text();
        console.log(respuesta_en_texto);
    } catch(error) {
        console.log("Falló en envío de datos al servidor local:", error);
    }
};`);
    console.log("\x1b[0m\x1b[33menviar_datos({ base: 'fichero', dato: {}, id: 'dato_unico' })");
    console.log("enviar_datos({ base: 'fichero', dato: {} })");
    console.log("\x1b[0m");
    console.log("[✓] Servidor escuchando en: " + ruta_de_servidor);
    console.log("");




});