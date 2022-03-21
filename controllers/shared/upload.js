const fs=require('fs');
const { validationResult } = require("express-validator");
const aws=require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { default: axios } = require('axios');


const s3=new aws.S3({
 
})

exports.uploadPdfController= async(req, res, next)=> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }
  // const userId=req.decodedToken.id;

// console.dir(req.files)
  const key=`${123}/${uuidv4()}.pdf`;


 


  // res.send("OK")
  
  let paths = req.files.map((e) => e.path);
    console.log(paths);

    var fp;


  try{
     s3.getSignedUrl('putObject',{
    Bucket:'heatpump-bucket',
    ContentType:'pdf',
    Key:key
  },(err,url)=>{
    
    fs.readFile(paths[0],(err,files)=>{

      console.log(files)

      axios.put(url,files,{
        headers:{
          'Content-Type':'pdf'
        }
      })
      .then(rep=>res.send(rep.data))
      .catch(err=>{
        res.json({
          err
        })
      })

      

    })


  })
    // res.json({
    //   success:true,
    //   data:{
    //     message: paths,
    //   }
    // });
  }
  catch(err){
    res.json({
      succes:false,
      data:{
        message:err.toString()
      }
    })
  }
   
}

exports.getPdfController=(req,res,next)=>{
  const {fp}=req.query;
  try{

    if(fs.existsSync(`./uploads/attachments-${fp}.pdf`)){
  var file = fs.createReadStream(`./uploads/attachments-${fp}.pdf`);
  var stat = fs.statSync(`./uploads/attachments-${fp}.pdf`);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  file.pipe(res);
    }else{
      res.json({
        success:false,
        data:{
          message:"Supplied File is unavailable in our server"
        }
      })
    }
  }
  catch(err){
    res.json({
      success:false,
      data:{
        message:"Supplied File is unavailable in our server"
      }
    })
  }
}