import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { updateOwnProfileValidator } from "../validators/profileValidator.js";
import { handleValidation } from "../middleware/validationMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/me", authenticate, profileController.getOwnProfile);
router.put("/me", authenticate, updateOwnProfileValidator, handleValidation, profileController.updateOwnProfile);
router.patch("/me", authenticate, authorizeRoles("CUSTOMER","MANAGER","EMPLOYEE"), profileController.suspendOwnProfile);
export default router;