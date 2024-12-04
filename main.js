'use strict';

const sentence = document.querySelector('.sentence');
const btn = document.querySelector('.btn');
const result = document.querySelector('.result');

btn.addEventListener('click', (event) => {
    event.preventDefault();
    // Trim elimina los espacios por delante y por detras de la frase
  const senteceValue = sentence.value.trim(); 
  if(!senteceValue){
    result.innerHTML = 'Escribe para el análisis por favor';
    return;
  }

  const apiKey = 'bf1fe6c324d9d10b4062f3502a4285198e2d9724';
  

  // Metodo POST en el fetch por requerimiento de la api
  fetch('https://api.nlpcloud.io/v1/distilbert-base-uncased-sentiment/sentiment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
    },
    body: JSON.stringify({text: senteceValue})
  })
  .then(response => {
    if(!response.ok){
        result.innerHTML = 'No se pudo realizar el análisis';
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })



});