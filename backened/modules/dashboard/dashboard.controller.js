import { asyncWrapper } from "../../middlewares/asyncWrapper.js";
import { dashboardService } from "./dashboard.service.js";

export const getDashboard = asyncWrapper(async (req,res)=>{
    const result = await dashboardService.getDashboard(req,res);
    res.status(200).json(result)
})
export const getCandidates = asyncWrapper(async (req,res)=>{
    const result = await dashboardService.getCandidates(req,res);
    res.status(200).json(result)
})
export const generateDashboard = asyncWrapper(async (req,res)=>{
    const result = await dashboardService.generateDashboard(req,res);
    res.status(200).json(result)
})

export const getjobStatus = asyncWrapper(async (req,res)=>{
    const result = await dashboardService.getJobStatus(req,res);
    res.status(200).json(result)
})