"use strict";

const sentence = document.querySelector(".sentence");
const btn = document.querySelector(".btn");
const result = document.querySelector(".result");
const wordsInput = document.querySelector(".words");
const btnWords = document.querySelector(".btn_words");
const resultWords = document.querySelector(".result_words");

const apiUrl =
  "https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";

const apiWordUrl =
  "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";

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
      // Encontramos el objeto con score mas alto, es decir, con el sentimiento mas probable y
      // reducimos con .reduce al sentimiento mas probable que es que tiene score mas alto.
      // .reduce compara elemento actual con anterior y lo reduce a uno segun la condicion
      // que le demos.

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
      }

      result.innerHTML = `Sentimiento: ${sentiment}`;
    })

    .catch((error) => {
      console.error("Error:", error);
      result.innerHTML = "Hubo un error al analizar el sentimiento.";
    });
});

// Segundo input

btnWords.addEventListener("click", (event) => {
  event.preventDefault();

  const wordsValue = wordsInput.value.trim();
  if (!wordsValue) {
    resultWords.innerHTML = "Please write your thoughts";
    return;
  }

  const words = wordsValue.split(" "); // Dividimos las palabras en un array
  let positiveCount = 0;
  let negativeCount = 0;

  const promises = words.map(async (word) => {
    // Hacemos una llamada a la api por cada palabra dividido con split
    return fetch(apiWordUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${window.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: word }),
    })
      .then((response) => {
        if (!response.ok) {
          resultWords.innerHTML = "Error in the analysis";
          return;
        }
        return response.json();
      })
      .then((data) => {
        // Utilizamos reduce para recoger el resultado deseado segun score
        const bestAnswer = data[0].reduce((prev, curr) =>
          curr.score > prev.score ? curr : prev
        );

        if (bestAnswer.label === "POSITIVE") {
          positiveCount++; // Llenamos positivo o negativo segun resultado
        } else if (bestAnswer.label === "NEGATIVE") {
          negativeCount++;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        resultWords.innerHTML = "There was an error in analyzing the sentiment";
      });
  });

  // Utilizamos Promise.all para esperar a que todas las peticiones terminen
  Promise.all(promises)
    .then(() => {
      console.log(`Positives: ${positiveCount}, Negatives: ${negativeCount}`);
      let finalSentiment;

      // Si el número de palabras positivas y negativas es igual, es "Neutral"
      if (positiveCount === negativeCount) {
        finalSentiment = "Neutral";
      } else if (positiveCount > negativeCount) {
        finalSentiment = "Positive";
      } else {
        finalSentiment = "Negative";
      }

      resultWords.innerHTML = `Sentiment based on words: ${finalSentiment}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      resultWords.innerHTML = "There was an error in analyzing the sentiment";
    });
});
