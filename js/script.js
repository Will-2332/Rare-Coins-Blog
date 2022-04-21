function getInfo () {
    fetch('https://mocki.io/v1/ae57db29-caba-473e-b8f4-81eb7c66f4be')
    .then(response=>response.json()).then(response=>console.log(response))};