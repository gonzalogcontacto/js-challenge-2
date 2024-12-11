"use strict";

const sentence = document.querySelector(".sentence");
const btn = document.querySelector(".btn");
const result = document.querySelector(".result");
const wordsInput = document.querySelector(".words");
const btnWords = document.querySelector(".btn_words");
const resultWords = document.querySelector(".result_words");

const apiUrl = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment";

const apiWordUrl = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';
  


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
      };

      result.innerHTML = `Sentimiento: ${sentiment}`;
    })

    .catch((error) => {
      console.error("Error:", error);
      result.innerHTML = "Hubo un error al analizar el sentimiento.";
    });
});


// Segundo input

btnWords.addEventListener('click', (event) => {
  event.preventDefault();

  const wordsValue = wordsInput.value.trim();
  if (!wordsValue) {
    resultWords.innerHTML = "Please write your thoughts";
    return;
  }

  const words = wordsValue.split(' '); // Dividimos las palabras en un array
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  

  words.map((word) => {
    fetch(apiWordUrl, {
      method: 'POST', 
      headers: {
        Authorization: `Bearer ${window.apiKey}`,
        'Content-Type': 'application/json', 
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
        console.log(`Datos para la palabra:`, data);
        console.log(`Palabra:`, word);

        const bestAnswer = data[0].reduce((prev, curr) =>
          curr.score > prev.score ? curr : prev
        );
        console.log(`Mejor respuesta:`, bestAnswer);
        console.log(`Mejor respuesta:`, bestAnswer.label);
        if (bestAnswer.label === "POSITIVE") {
          positiveCount++;
        } else if (bestAnswer.label === "NEGATIVE") {
          negativeCount++;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        resultWords.innerHTML = "There was an error in analyzing the sentiment";
      })
      .finally(() => {
        neutralCount++;

        if (neutralCount === words.length) {
          let finalSentiment;
          if (positiveCount > negativeCount) {
            finalSentiment = "Positive";
          } else if (negativeCount > positiveCount) {
            finalSentiment = "Negative";
          } else {
            finalSentiment = "Neutral";
          }

          resultWords.innerHTML = `Sentiment based on words: ${finalSentiment}`;
        }
        


        
      });
  });

});
