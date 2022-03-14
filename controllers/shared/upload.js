const { validationResult } = require("express-validator");

const fs=require('fs');

exports.uploadPdfController= (req, res, next)=> {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }
    let paths = req.files.map((e) => e.path);
    res.json({
      success:true,
      data:{
        message: paths,
      }
    });
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