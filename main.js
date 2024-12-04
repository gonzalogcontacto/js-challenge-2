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
  
  const apiUrl = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';
  const apiKey = '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';
  
  
  


  // Metodo POST en el fetch por requerimiento de la api
  fetch(apiUrl, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({inputs: senteceValue}),
  })
  .then(response => {
    if(!response.ok){
        result.innerHTML = 'No se pudo realizar el análisis';
        return;
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })



});