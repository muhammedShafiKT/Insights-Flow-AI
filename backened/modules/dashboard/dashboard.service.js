import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Dataset from "../datasets/dataset.model.js"
import { runAnalysis } from "../../services/analytics/runAnalysis.js"
import { generateChart } from "../../services/generateDashboard/generateChart.js"
import { getSignedDownloadUrl } from "../datasets/r2Storage.service.js"

const createError = (message,statusCode)=>{
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}
export const dashboardService = {
    getDashboard : async (req,res)=>{
     const dataset = await Dataset.findOne({_id:req.params.id,userId : req.user.userId})
     if(!dataset){
        createError("Dataset not found",404)
     }
     return {
        success :true,
        dashboard : dataset.dashboard
     }
    },
     getCandidates : async (req,res)=>{
     const dataset = await Dataset.findOne({_id:req.params.id,userId : req.user.userId})
     if(!dataset){
        createError("Dataset not found",404)
     }
     return {
        success :true,
        candidates : dataset.candidates
     }
    },
     generateDashboard : async (req,res)=>{
        const {candidates :selectedCandidates} = req.body
        if(!Array.isArray(selectedCandidates)||selectedCandidates.length===0){
            throw createError("Select atleast One",400)
        }
        if(selectedCandidates.length>8){
            throw createError("Select atleast One",400)
        }
     const dataset = await Dataset.findOne({_id:req.params.id,userId : req.user.userId})
     if(!dataset){
        createError("Dataset not found",404)
     }
     const signedUrl = await getSignedDownloadUrl(dataset.r2Key)
     const analyses = await runAnalysis(selectedCandidates,signedUrl,dataset.fileType , dataset.skipRows)
     const charts = analyses.map(generateChart)

     dataset.dashboard = {
          generatedAt : new Date(),
  chartCount : charts.length,
  charts
     }
     await dataset.save()
     return {
        success :true,
        dashboard : dataset
     }
    }


}
