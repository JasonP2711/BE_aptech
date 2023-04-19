
var express = require("express")
var router = express.Router()
const yup = require('yup');

const {write} =  require('../helper/FileHelper');
let data = require('../data/Employee.json');
const fileName = './routes/data/Employee.json';

/* 
const data = [
    { id: 1, name: 'Mary', email: 'mary@gmail.com', gender: 'female' },
    { id: 2, name: 'Honda', email: 'honda@gmail.com', gender: 'male' },
    { id: 3, name: 'Suzuki', email: 'suzuki@gmail.com', gender: 'male' },
  ];
 */
  router.get('/',function(req,res,next){
    res.send(data);
  });

  router.post('/',function(req,res,next){
    
    const validationSchema = yup.object().shape({
      body: yup.object({
        firstName: yup.string().required().max(10),
      lastName: yup.string().required(),
      phoneNumber: yup.string().required(),
      address: yup.string().required(),
      email: yup.string().email().required(),
      birthDay: yup.string()
      })
      
    })

    validationSchema.validate({body: req.body},{ abortEarly: false }).then(()=>{
      const newItem = req.body;
    let maxIndex = 0;
  
    data.forEach((item)=>{
      if(item.id>maxIndex){
        maxIndex = item.id;
      }
    }
  )
    newItem.id = maxIndex + 1;
    data.push(newItem);
    // console.log(newItem);
    write(fileName,data);

    res.send({message:'add new item'});
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errows: err.errows,
        message: err.message,
        provider: "yup",
      });
    });
});

  router.delete('/:id',function(req,res,next){
    const id = req.params.id;
    data = data.filter((item)=>( item.id != id)
      
    ); 
    res.send({mesasage: 'delete'});
  });

  router.patch('/:id',function(req,res,next){
    
    const id = req.params.id;
    console.log(id);
    const content = req.body;

    let found = data.find((item)=>(
      item.id==id
    ));
      if(found){
    for(let propertyName in content){
      found[propertyName] = content[propertyName];
    }
    }
    res.send({message: "patch"})
  })

  module.exports = router;
  

  

// module.exports = router;