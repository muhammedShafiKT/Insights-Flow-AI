import express from "express"
import verifytoken from "../../middlewares/verifytoken.js"
import { generateDashboard, getCandidates, getDashboard, getjobStatus } from "./dashboard.controller.js"
const router= express.Router()

router.get("/:id/dashboard",verifytoken,getDashboard)
router.get("/:id/candidates",verifytoken,getCandidates)
router.post("/:id/dashboard",verifytoken,generateDashboard)
router.get("/:id/dashboard/job", verifytoken, getjobStatus);
export default router