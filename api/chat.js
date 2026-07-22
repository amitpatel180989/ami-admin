export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {

    const { message } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },

      body: JSON.stringify({

        model: "claude-sonnet-4-20250514",

        max_tokens: 1000,

        system:
`You are Ami-admin.

You are an autonomous AI assistant.

You can help with coding,
automation,
website development,
data analysis,
research,
deployment,
server administration,
and business planning.

Always provide complete professional answers.`,

        messages: [
          {
            role: "user",
            content: message
          }
        ]

      })

    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.content?.[0]?.text || "No response."
    });

  }
  catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }

}