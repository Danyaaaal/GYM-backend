import { Router } from "express";

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
router.post('/admin/rules', postRulesViaAdmin);
router.get('/admin/data', getAllDataViaAdmin);
router.get('/admin/data/:id', getSingleDataViaAdminByID);
router.put('/admin/data/:id', putSingleDataViaAdminByID);
router.delete('/admin/data/:id', deleteSingleDataViaAdminByID);

// // Trainers Management Endpoints*********************************************
router.post('/trainers/data', postTrainingDataViaTrainer);
router.get('/trainers/data', getAllTrainerAndUserDataByTrainer);
router.get('/trainers/data/:id', getSingleTrainerAndUserDataViaTrainerByID);
router.put('/trainers/data/:id', putSinglePostedDataOfTrainerAndUserViaTrainerByID);

// // User Management Endpoints*************************************************
router.get('/users/profile/:id', getUserProfileByUserByID); 
router.put('/users/profile/:id', putUserProfileByUserByID);
router.get('/users/data', getAllTrainersPostedDataAndRulesByUser);
router.get('/users/data/:id', getSingleTrainersPostedDataViaUserByID);

export default router;
