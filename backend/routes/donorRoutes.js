import express from "express";
import {
  searchDonors,
  getAllDonors,
  updateDonorProfile,
  deleteDonorProfile,
  getDonorStats,
  softdeleteDonorProfile,
  changePassword,
} from "../controllers/donorController.js";

import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   🌍 PUBLIC ROUTES
========================= */

// أي حد يقدر يستخدمهم بدون تسجيل دخول
router.get("/search", searchDonors);
router.get("/all", getAllDonors);
router.get("/DonorStats", getDonorStats);

/* =========================
   🔒 PROTECTED ROUTES
========================= */

// من هنا لازم تسجيل دخول
router.use(protect);

/* =========================
   👤 DONOR / ADMIN ACTIONS
========================= */

router.put(
  "/update",
  restrictTo("donor", "admin", "super_admin"),
  updateDonorProfile,
);

router.delete("/delete", restrictTo("donor", "admin"), deleteDonorProfile);

router.delete(
  "/soft-delete",
  restrictTo("donor", "admin"),
  softdeleteDonorProfile,
);

router.put("/change-password", restrictTo("donor", "admin"), changePassword);

export default router;
