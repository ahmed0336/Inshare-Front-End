const router = require('express').Router();
const File = require('../models/file');




router.get('/:uuid', async  (req,resp)=>{
 
    let file = await File.findOne({uuid:req.params.uuid})

    if(!file){
        resp.status(404).json({
            message:"data not found"
        })
    }

    let Filepath =`${__dirname}/../${file.path}`

    // console.log(Filepath.path)

    // resp.status(200).download(Filepath)
    resp.download(Filepath)




})






 module.exports=router;