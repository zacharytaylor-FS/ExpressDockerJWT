var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 
router.post("/generateToken", (req, res) => { //* 1
  
  let jwtSecretKey = process.env.JWT_SECRET_KEY; //* 2
  let data = {time: Date(),userId: 12,} //* 3
  
  const token = jwt.sign(data, jwtSecretKey);//* 4
  
  res.send(token); //* 5
}); 

router.get("/validateToken", (req, res) => { //* 6
    
  
   let tokenHeaderKey = process.env.TOKEN_HEADER_KEY; //* 7
   let jwtSecretKey = process.env.JWT_SECRET_KEY; //* 8
  
    try {
       const token = req.header(tokenHeaderKey); //* 9
  
         const verified = jwt.verify(token, jwtSecretKey); //* 10
        if(verified){ //* 11
            return res.send("Successfully Verified"); //* 11
         }else{ //* 11
            // Access Denied
             return res.status(401).send(error); //* 11
        }
     } catch (error) { //* 12
        // Access Denied
         return res.status(401).send(error); //* 12
    }
});

module.exports = router;
