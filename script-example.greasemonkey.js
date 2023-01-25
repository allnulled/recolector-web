// ==UserScript==
// @name     Scrapeo de empresas
// @version  1
// @grant    none
// ==/UserScript==

if(!window.location.href.startsWith("https://www.google.com/search?q=")) {
	return;
}

window.addEventListener("load", function() {
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
  const boton = document.createElement("button");
  boton.textContent = "Enviar datos de empresa";
  Object.assign(boton.style, {
    position: "fixed",
    zIndex: 9999,
    top: 0,
    left: "auto",
    right: 0,
    bottom: "auto",
  });
  boton.addEventListener("click", function() {
    try {
      const datos = Array.from(document.querySelectorAll("#rso a")).map(a => {
        try {
        	return (new URL(a.href)).searchParams.get("u");
        } catch(error) {
          return undefined;
        }
      }).filter(r => !!r);
      enviar_datos({
        base: "empresas",
        dato: datos,
        id: new URL(location.href).searchParams.get("q")
      }).then(() => window.close());
    } catch(error) {
      console.log(error);
    }
  });
  document.body.appendChild(boton);
  setTimeout(() => boton.click(), 5000);
});