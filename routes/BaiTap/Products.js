var express = require('express')
var router = express.Router()
const yup =require("yup");

let data = require('../data/Products.json');
const fileName = './routes/data/Products.json';
const {write} = require('../helper/FileHelper');

router.get('/',(req,res,next)=>{
    res.send(data);
})

router.post('/',(req,res,next)=>{
    const validationSchema = yup.object({
        body: yup.object({
            name: yup.string().required(),
            price: yup.number().positive().required(),
            discount: yup.number().positive().max(100).required(),
            stock: yup.number().positive().required(),
            categoriesID: yup.number().required(),
            suppliesID: yup.number().required(),
            description: yup.string().required()
        })
    });
    validationSchema.validate({body: req.body},{abortEarly:false})
    .then(()=>{
        let newItem = req.body;
        let maxid = 0;
        data.forEach(element => {
            if(element.id>maxid)
            maxid=element.id;
        })
        
        maxid = maxid + 1;
        newItem.id = maxid;
        data.push(newItem);
        write(fileName,data);
        res.send({ok: true, message: "Post"})
    })
    .catch((err)=>{
        return res.status(400).json({
            type: err.name,
          errors: err.errors,
          message: err.message,
          provider: "yup",
        });
    })
});

router.delete('/:id',(req,res,next)=>{
    id = req.params.id;
    data = data.filter((item=>(item.id!=id)));
    res.send({ok:true, message: "delete!"})
    write(fileName,data);
})

router.patch('/:id',(req,res,next)=>{
   const id = req.params.id;
   let content = req.body;
   let found = data.find((item)=>(item.id==id));
    if(found){
        for(let item in content){
            found[item] = content[item];
        }
    }

    res.send({ok:true, message:"patch"})
    write(fileName,data);
})

module.exports = router;



