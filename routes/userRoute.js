import { Router } from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";

import {
    signup,
    login,
    postRulesViaAdmin,
    getAllDataViaAdmin,
    getSingleDataViaAdminByID,
    putSingleDataViaAdminByID,
    deleteSingleDataViaAdminByID,
    postTrainingDataViaTrainer,
    getAllTrainerAndUserDataByTrainer,
    getSingleTrainerAndUserDataViaTrainerByID,
    putSinglePostedDataOfTrainerAndUserViaTrainerByID,
    getUserProfileByUserByID,
    putUserProfileByUserByID,
    getAllTrainersPostedDataAndRulesByUser,
    getSingleTrainersPostedDataViaUserByID
  } from "../controllers/userController.js";

const router = Router();

/// Authentication Endpoints
router.post('/signup', signup);
router.post('/login', login);

// // Admin Management Endpoints************************************************
router.post('/admin/rules',authorizeAdmin, postRulesViaAdmin);
router.get('/admin/data', authorizeAdmin, getAllDataViaAdmin);
router.get('/admin/data/:id', authorizeAdmin, getSingleDataViaAdminByID);
router.put('/admin/data/:id', authorizeAdmin, putSingleDataViaAdminByID);
router.delete('/admin/data/:id', authorizeAdmin, deleteSingleDataViaAdminByID);

// // Trainers Management Endpoints*********************************************
router.post('/trainers/data', postTrainingDataViaTrainer);
router.get('/trainers/data', getAllTrainerAndUserDataByTrainer);
router.get('/trainers/data/:id', getSingleTrainerAndUserDataViaTrainerByID);
router.put('/trainers/data/:id', putSinglePostedDataOfTrainerAndUserViaTrainerByID);

// // User Management Endpoints*************************************************
router.get('/users/profile/:id', authenticateUser, getUserProfileByUserByID); 
router.put('/users/profile/:id', authenticateUser, putUserProfileByUserByID);
router.get('/users/data', authenticateUser, getAllTrainersPostedDataAndRulesByUser);
router.get('/users/data/:id', authenticateUser, getSingleTrainersPostedDataViaUserByID);

export default router;
