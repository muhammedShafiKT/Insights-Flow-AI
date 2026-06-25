import  OpenAI  from "openai"
const client = new OpenAI({
    apiKey : process.env.GROQ_API_KEY,
    baseURL :"https://api.groq.com/openai/v1",
})

export async function generateAnswerfromllm(prompt){
const response = await client.chat.completions.create({
     model: "llama-3.3-70b-versatile",
    temperature : 0,
    messages : [
        {
        role: "system",
        content: "You are an expert SQL generator. Return only valid DuckDB SQL.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]
})
return response.choices[0].message.content.trim()
}