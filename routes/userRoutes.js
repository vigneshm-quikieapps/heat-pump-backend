const router=require('express').Router();

const usersController=require('../controllers/users/usersController')


router.get('/users',usersController.getAllUsers);
router.patch('/users',usersController.patchUser);
router.get('/users-count',usersController.getUsersStatus)

module.exports=router;