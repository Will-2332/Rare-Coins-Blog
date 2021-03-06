const express = require("express");
const coinsModel = require("../models/coins");
const app = express();

/*
app.post("/api/coins", async (request, response) => {
      const coins = new coinsModel(request.body);
    
      try {
        await coins.save();
        response.send(coins);
      } catch (error) {
        response.status(500).send(error);
      }
    });
 
app.patch("/api/coins/:id", async (request, response) => {
  try {
    await coinsModel.findByIdAndUpdate(request.params.id, request.body);
    await coinsModel.save();
    response.send(coin);
  } catch (error) {
    response.status(500).send(error);
  }
});
 
app.delete("/api/coins/:id", async (request, response) => {
  try {
    const coins = await coinsModel.findByIdAndDelete(request.params.id);
 
    if (!coins) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});
 
app.get('/api/coins/:id', (req, res) => {
  Coins.find({}, function (err, coins) {
    res.render('index.html', {
      CoinsList: coins
    })
  })
})
 
 
*/
module.exports = {
  findCoins: async function () {
    const coins = await coinsModel.find({});
    return coins
  },
}

/*module.exports = {
  addCoins: async function () {
    const coins = await coinsModel.updateOne({
      { Year: req.Year },
      { Denomination: req.denom },
      { Pic: req.pic },
      { History: req.History },
      { Value: req.History },
      { status: req.status },
      { upsert: true, useFindAndModify: false },
      console.log(str);
  });
},
  }

/*{
$push:
  { Year: req.body.year }
 { Denomination: req.body.Denomination }
 { Pic: req.body.pic }
 { History: req.body.History }
 { Value: req.body.History }
});*/