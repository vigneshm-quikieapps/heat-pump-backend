const router=require('express').Router();

const usersController=require('../controllers/users/usersController')


router.get('/users',usersController.getAllUsers);
router.patch('/users',usersController.patchUser);


module.exports=router;