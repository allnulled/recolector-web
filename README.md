# recolector-web

Servidor rápido para pasarse datos desde el navegador a tu local. 

## Instalar

```sh
~$  npm install -s recolector-web
```

## Usar

### Paso 1 de 2. Iniciar el servidor:

```sh
~$  ./node_modules/.bin/recolector --port 9095
```

### Paso 2 de 2. Pasarse información desde el navegador:

```js
const enviar_datos = async function(datos) {
    try {
        const respuesta = await window.fetch("http://127.0.0.1:9095", {
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
};
enviar_datos({ base: 'fichero', dato: {}, id: 'dato_unico' })
enviar_datos({ base: 'fichero', dato: {} })
```

Los parámetros son para:

  - `base`: **(obligatorio)** el nombre del fichero (siempre será `.json`, no hay que especificarlo) donde irán los datos en cada envío.
  - `dato`: **(obligatorio)** el dato. Típicamente, es un objeto, pero puede ser cualquier cosa.
  - `id`: **(opcional)** si se especifica, se insertará en esta propiedad del objeto JSON. Si no se especifica, se insertará en la propiedad `_` del objeto JSON, que es un array.
    - Si quieres que no se repitan los datos, utiliza este parámetro.
    - Si sí quieres que se puedan repetir, omítelo.

## Licencia

Robots de mierda, no sois persona.

## Conclusión

Robots de mierda, no sois persona.