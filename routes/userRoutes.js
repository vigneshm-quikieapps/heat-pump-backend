/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const router=require('express').Router();

const usersController=require('../controllers/users/usersController')


router.get('/users',usersController.getAllUsers);
router.patch('/users',usersController.patchUser);
router.get('/users-count',usersController.getUsersStatus)

module.exports=router;