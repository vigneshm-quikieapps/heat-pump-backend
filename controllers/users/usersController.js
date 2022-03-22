const UserModel=require('../../models/users.model')
const {validationResult}=require('express-validator');




exports.getAllUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array(),
      });
    }
  
    const userId = req.decodedAccessToken.id;
    const email = req.decodedAccessToken.email;
    var { page, perPage ,status} = req.query;
    const statuses=status.split(',')
    
    var mp=new Map();
    const searchArray=[];
  
    for(let status of statuses){
      searchArray.push({status:status});
      mp.set(parseInt(status),true);
    }
  
    if(mp.size==0){
       console.log("DF")
      searchArray.push({status:1})
      searchArray.push({status:2})
    }
    
    if (!page) {
      page = 1;
    }
    if (!perPage) {
      perPage = 10;
    }
  
    
    
    
    
    // console.log(searchArray)
    const SKIP=perPage * (page - 1);
    const LIMIT=perPage;
    const response=await UserModel.find({$or:searchArray});
    const data=await UserModel.find({$or:searchArray}).skip(SKIP).limit(LIMIT);

    
    const total_records =response.length;
    const current_page=page;
    const total_pages=Math.ceil(total_records/perPage);
    res.send({
      total_pages,current_page,total_records,
      data:{
        data:data
      }
    })
    
    
    // const foundServiceRequests = [...response.service_requests];
   
    // const total_records=response2.service_requests.length;
  
    // const respArray = [];
  
    // for (let i = 0; i < foundServiceRequests.length; i++) {
    //   console.log(foundServiceRequests[i].status)
     
    //   if(mp.get(foundServiceRequests[i].status)===true)
    //   {respArray.push(foundServiceRequests[i]);}
    // }
    
  
    // const total_records=respArray.length
  
  
    // console.log("TR",total_records)
  
  
    // const total_pages = Math.ceil(total_records / perPage);
  
    // res.json({
    //   success: true,
    //   data: {
    //     message: "OK",
    //     total_records: total_records,
    //     total_pages: total_pages,
    //     current_page: page,
    //     data: respArray,
    //   },
    // });


  };
  

  exports.patchUser=async (req,res,next)=>{

    const {id}=req.query;
    
    try{
      const rsp=await UserModel.findByIdAndUpdate(id,req.body);
      res.send({
        success:true,
        data:{
          message:"updated"
        }
      })


    }
    catch(err){
      res.send({
        success:false,
        data:{
          message:err.toString()
        }
      })
    }

  }

  
exports.getUsersStatus = async (req, res, next) => {
  const userId = req.decodedAccessToken.id;
  
  const response = await UserModel.find({admin:false})
console.log(response);
  const sArray = response;

  let neww = 0,
    inprogress = 0,
    active = 0;

  for (let i = 0; i < sArray.length; i++) {
    switch (sArray[i].status) {
      case 1:
        neww += 1;
        break;
      case 2:
        inprogress += 1;
        break;
      case 3:
        active += 1;
        break;
    }
  }

  res.json({
    success: true,
    data: {
      total:sArray.length,
      new: neww,
      inprogress: inprogress,
      active: active,
    },
  });
};
