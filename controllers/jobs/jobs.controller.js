const JobsModel = require("../../models/jobs.models");
const UserModel=require('../../models/users.model')
const {reversedNum}=require('../../utils/helpers');


exports.postJob = async (req, res, next) => {
  const { title, description, site_details,attachments } = req.body;

  const time = new Date().getTime();


  const userId=req.decodedAccessToken.id;
  console.log(userId);



  const id = reversedNum(time);
  const job_ref_number = "JR" + reversedNum(parseInt(id + Math.random() * 100));

  try {
    const job = new JobsModel({
      title: title,
      description: description,
      site_details: site_details,
      job_ref_number: job_ref_number,
    });

    const response = await job.save();
    const objId=response._id.toString();

    
        const user=await UserModel.findById(userId);
        user.jobs.push(objId);
        user.save();
    
    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
      res.json({
          success:false,
          data:{
              message:err.toString()
          }
      })
  }
};


exports.getAllJobs=async (req,res,next)=>{

    const userId=req.decodedAccessToken.id;
    console.log(userId);


    var {page,perPage}=req.query;

    if(!page){
      page=1;
    }
    if(!perPage){
      perPage=10
    }

    try{

        const response=await UserModel.findById(userId).populate([
          {
            path:"jobs",
            model:"Job",
            options:{
              sort:{},
              skip:perPage*(page-1),
              limit:perPage
            }
          }
        ])
        const total_records=(response.jobs.length);

        const foundJobs=[...response.jobs];
        const respArray=[];

        for(let i=0;i<foundJobs.length;i++){
          respArray.push(foundJobs[i])
        }

        const total_pages=Math.ceil(total_records/perPage);


        res.json({
          success:true,
          data:{
            total_records:total_records,
            total_pages:total_pages,
            current_page:page,
            data:respArray
          }
        })
        



    }catch(err){
      res.json({
        success:false,
        data:{
          message:err.toString()
        }
      })
    }
}