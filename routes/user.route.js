import { Router } from "express";
import {
  signup,
  login,
  getProtected,
  getAdmin,
  postAdmin,
  getAllData,
  getDataById,
  putSingDataById,
  deleteSingleDataById,
  postExercise,
  getAllDataByTrainer,
  getSingleDataById,
  updateSingDataById,
  getAllDataByUser,
  getUserProfile,
  updateUserProfileById
} from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {isTrainer} from "../middleware/isTrainer.js";

const router = Router();

// General Section
router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", isAuth, getProtected);
// Admin Section
router.get("/admin", isAuth, isAdmin, getAdmin);
router.post("/admin", isAuth, isAdmin, postAdmin);
router.get("/admin/data", isAuth, isAdmin, getAllData);
router.get("/admin/data/:id", isAuth, isAdmin, getDataById);
router.put("/admin/data/:id", isAuth, isAdmin, putSingDataById);
router.delete("/admin/data/:id", isAuth, isAdmin, deleteSingleDataById);
// Trainer Section
router.post("/exercise", isAuth, isTrainer, postExercise);
router.get("/data", isAuth, isTrainer, getAllDataByTrainer);
router.get("/data/single/:id", isAuth, isTrainer, getSingleDataById);
router.put("/data/single/:id", isAuth, isTrainer, updateSingDataById);
// User Section
router.get("/data/user", isAuth, getAllDataByUser);
router.get("/user/profile", isAuth, getUserProfile);
router.put("/user/profile/:id", isAuth, updateUserProfileById);

export default router;
