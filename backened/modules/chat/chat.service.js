import Dataset from "../datasets/dataset.model.js"
import { getSignedDownloadUrl } from "../datasets/r2Storage.service.js"
import { answerPrompt } from "./answerprompt.js"
import { buildContext } from "./buildContext.js"
import { buildPrompt } from "./buildPrompt.js"
import { executeSQL } from "./executeSQL.js"
import { generateAnswerfromllm } from "./llm.service.js"

export const chatService = {
    processQuestion: async ({ datasetId, question, history = [] }) => {
        const dataset = await Dataset.findById(datasetId)

        if (!dataset) {
            throw new Error("Dataset not found")
        }

        const signedUrl = await getSignedDownloadUrl(dataset.r2Key)
        const context = buildContext(dataset)  
        const sqlprompt = buildPrompt({
            context,
            question,
            history
        })

        const sql = await generateAnswerfromllm(sqlprompt)
        console.log("Generated SQL:", sql);
        if (sql.trim() === "INSUFFICIENT_SCHEMA") {
    return {
        answer:
            "I couldn't answer that because the uploaded dataset doesn't contain the required information.",
        sql: null,
        rows: []
    };
}
        // console.log("generated sql", sql)

        const rows = await executeSQL(sql, signedUrl,dataset.fileType, dataset.skipRows)
        // console.log("query result", rows)

        const prompt = answerPrompt({question,rows})
        const answer = await generateAnswerfromllm(prompt)
        

        return { sql, rows ,answer }
    }
}
