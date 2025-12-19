export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text field is required and must be a string' });
    }

    // Make request to BERN2 API
    const response = await fetch("http://bern2.korea.ac.kr/plain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error(`BERN2 API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the result
    res.status(200).json(data);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}
