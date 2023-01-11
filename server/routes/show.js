const File = require('../models/file');

const router = require('express').Router();

router.get('/:uuid', async (req,resp)=>{

    try{
        let file = await File.findOne({  uuid:req.params.uuid})

        console.log("file==>",file)

        if(!file)
        {
            resp.status(404).json({
                message:"no data found"
            })

        }

        resp.status(200).json({
            message:"get data",
            data:file
        })
 
        

    }catch (err) {

        resp.status(505).json({
            error:"something want wrong!"
        })

    }

    



})



// router.get('/products',  async (req,resp)=>{

//     let products = await File.find();
    
//     if(products.length > 0){
      
//      resp.send(products)
 
//     }
//     else{
//      resp.send({result:"No Data Found"})
//     }
 
//  })









module.exports = router