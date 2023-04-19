var express = require("express");
var router = express.Router();
const yup = require("yup")

const {write} = require('../helper/FileHelper');
let data = require('../data/Supplier.json');
const fileName = './routes/data/Supplier.json';

router.get('/',(req,res,next)=>{
    res.send(data);
});

router.post('/',(req,res,next)=>{

    const validationSChema = yup.object().shape({
        body: yup.object({
            name: yup.string().required(),
            email: yup.string().required().email(),
            phoneNumber: yup.string().required(),
            address: yup.string().required()
        })
    });

    validationSChema.validate({body: req.body},{abortEarly: false}).then(()=>{
    const newItem = req.body;
    let max=0;
    data.forEach((item) => {
        if(item.id>max){
            max=item.id;
        }
    });
    newItem.id = max+1;
    data.push(newItem);
    write(fileName,data);
    res.send({message: "post"});
    })
    .catch((err)=>{
        return res.status(400).json({
            type: err.name,
            errors: err.errors,
            message: err.message,
            provider: "yup"
        });
    });
});

router.delete('/:id',function(req,res,next){
    const id = req.params.id;
    data = data.filter((item)=>( item.id != id)
      
    ); 
    res.send({mesasage: 'delete'});
  });

router.patch('/',(req,res,next)=>{
    const id = req.params.id;
    let content = req.body;
    const found = data.find((item)=>(
        item.id == id
    ));
    if(found){
        for(let property in content){
            data[property] = content[property];
        }
    }
    res.send({message: "patch"});
    
})

module.exports = router;
