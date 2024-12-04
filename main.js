"use strict";

const sentence = document.querySelector(".sentence");
const btn = document.querySelector(".btn");
const result = document.querySelector(".result");

const apiUrl =
  "https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";

btn.addEventListener("click", (event) => {
  event.preventDefault();
  // Trim elimina los espacios por delante y por detras de la frase
  const senteceValue = sentence.value.trim();
  if (!senteceValue) {
    result.innerHTML = "Escribe para el análisis por favor";
    return;
  }

  // Metodo POST en el fetch por requerimiento de la api
  fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: senteceValue }),
  })
    .then((response) => {
      if (!response.ok) {
        result.innerHTML = "No se pudo realizar el análisis";
        return;
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Encontramos el objeto con score mas alto, es decir, con el sentimiento mas probable y
      // reducimos con .reduce al sentimiento mas probable que es que tiene score mas alto.

      const mostLikely = data[0].reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev
      );

      // Convierto la respuesta al español
      let sentiment = mostLikely.label;
      if (sentiment === "positive") {
        sentiment = "Positivo";
      } else if (sentiment === "negative") {
        sentiment = "Negativo";
      } else if (sentiment === "neutral") {
        sentiment = "Neutral";
      };

      result.innerHTML = `Sentimiento: ${sentiment}`;
    })
    
    .catch((error) => {
      console.error("Error:", error);
      result.innerHTML = "Hubo un error al analizar el sentimiento.";
    });
});
