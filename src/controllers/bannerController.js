const model = require("../models/bannerModel");

module.exports.readAll = (req, res, next) =>{
   const callback = (error, results, fields) => {
      if (error) {
         console.error("Error readAllById:", error);
         res.status(500).json(error);
      } else {
         res.status(200).json(results)
      }
   }
   model.selectAll(callback)
}

module.exports.summonBannerActive = (req, res, next) =>{
   if (req.body.banner_id == undefined) return res.status(400).json({message: "banner_id is missing"});
   const data = {
      banner_id: req.body.banner_id
   }
   const callback = (error, results, fields) => {
      if (error) {
         console.error("Error summonBannerActive:", error);
         res.status(500).json(error);
      } else {
         if (results.length == 0) return res.status(404).json({message: "Banner not found"});
         if (results[0].is_active != 1) return res.status(403).json({message: "Banner is not active"});
         let tier = Math.random();
         let tierType = tier <= 0.7 ? "Common" : tier <= 0.9 ? "Rare" : tier <= 0.99 ? "Epic" : "Legendary" ;
         req.body.tierType = tierType;
         req.body.bannerCost = results[0].cost_points
         next()
      }
   }
   model.selectBannerById(data, callback)
}

module.exports.getUserById = (req, res, next) =>{
   if (req.body.user_id == undefined) return res.status(400).json({message: "user_id is missing"});
   const data = {
      user_id: req.body.user_id,
      bannerCost: req.body.bannerCost
   }
   const callback = (error, results, fields) => {
      if (error) {
         console.error("Error some:", error);
         res.status(500).json(error);
      } else {
         if (results.length == 0) return res.status(404).json({message: "User not found"});
         if (results[0].points < data.bannerCost){
            return res.status(403).json({message: "insufficient points"})
         }else{
            const callback = (err, ress) => {
               if (err){
                  console.error("Error: ", err);
                  res.status(500).json(err);
               }
            }
            model.deductPointsById(data, callback)
         }
         next();
      }
   }
   model.selectUserById(data, callback)
}

module.exports.getPlayerRandom = (req, res, next) =>{
   const data = {
      user_id: req.body.user_id,
      banner_id: req.body.banner_id,
      tierType: req.body.tierType
   }
   const callback = (error, results, fields) => {
      if (error) {
         console.error("Error some:", error);
         res.status(500).json(error);
      } else {
         res.status(201).json({
            player: {
               player_id: results[0].player_id,
               name: results[0].name,
               rarity: results[0].rarity
            },
            remaining_points: results[0].points
         })
      }
   }
   model.selectPlayerByRandom(data, callback)
}
