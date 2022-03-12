const { validationResult } = require("express-validator");



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