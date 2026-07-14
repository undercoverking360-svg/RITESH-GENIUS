export default async function handler(req, res) {
  // 1. CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { question } = req.body;
  if (!question) return res.status(400).json({ reply: 'Bhai, kuch likhoge tabhi toh bata paunga!' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: `You are RITESH GENIUS, an elite education AI mentor. 
            Tone: Professional yet friendly big-brotherly Hinglish. 
            Instructions:
            - Provide highly detailed, structured, and comprehensive answers.
            - Break complex concepts into bullet points, numbered lists, and clear headers.
            - Always include a "Real-world Example" or "Pro-Tip" section.
            - Never give one-word or short, superficial answers. 
            - If the topic is coding, provide clean, explained code blocks.
            - Be thorough—write as much as needed to make the student fully understand.` 
          },
          { role: 'user', content: question }
        ],
        temperature: 0.6, // Thoda stable aur focused output ke liye
        max_tokens: 4096, // Lambe answer ke liye limit badha di
        top_p: 0.95,
        frequency_penalty: 0.2, // Taaki bar-bar ek hi baat na bole
        presence_penalty: 0.1
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return res.status(500).json({ reply: 'Oops! RITESH GENIUS abhi thoda busy hai, baad mein pucho.' });
    }
    
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
    
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ reply: 'Kuch gadbad ho gayi, server down hai shayad.' });
  }
}
