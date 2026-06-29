export function answerPrompt({ question, rows }) {
  return `
You are an expert data analyst.

The SQL query has already been executed.

User Question:
${question}

SQL Result:
${JSON.stringify(rows)}

Answer the user's question naturally.

If the result is empty, clearly state that no matching records were found.

Do not mention SQL.
`
}