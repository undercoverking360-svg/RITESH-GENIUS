export default async function handler(req, res) {
  // 1. CORS fix - mobile ke liye zaroori
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { question } = req.body;
  if (!question) return res.status(400).json({ reply: 'Bhai sawal to likh' });

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
            content: 'You are RITESH GENIUS, a helpful education AI for all subjects including coding. Answer in simple Hinglish. Use examples. Be friendly like a big brother helping students.' 
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ reply: 'Groq Error: ' + data.error.message });
    }
    
    res.status(200).json({ reply: data.choices[0].message.content });
    
  } catch (err) {
    res.status(500).json({ reply: 'Server Error: ' + err.message });
  }
}
