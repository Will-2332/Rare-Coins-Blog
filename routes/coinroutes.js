const express = require("express");
const coinsModel = require("../models/coins");
const app = express();

app.get("/coins", async (request, response) => {
  const coins = await coinsModel.find({});

  try {
    response.send(coins);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/coins", async (request, response) => {
    const coins = new coinsModel(request.body);
  
    try {
      await coins.save();
      response.send(coins);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.patch("/coins/:id", async (request, response) => {
    try {
      await coinsModel.findByIdAndUpdate(request.params.id, request.body);
      await coinsModel.save();
      response.send(coin);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.delete("/coins/:id", async (request, response) => {
    try {
      const coins = await coinsModel.findByIdAndDelete(request.params.id);
  
      if (!coins) response.status(404).send("No item found");
      response.status(200).send();
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/coins/:id', (req, res) => {
    Coins.find({}, function(err, coins) {
        res.render('index.html', {
            CoinsList: coins
        })
    })
})
  

module.exports = app;