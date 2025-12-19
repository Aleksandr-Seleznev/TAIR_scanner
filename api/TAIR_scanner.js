// Save this as: api/TAIR_scanner.js

export default async function handler(req, res) {
  // Add CORS headers to allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', JSON.stringify(req.body));
    
    const { text } = req.body;

    // Validate input
    if (!text) {
      console.log('Missing text field');
      return res.status(400).json({ error: 'Text field is required' });
    }

    if (typeof text !== 'string') {
      console.log('Text is not a string:', typeof text);
      return res.status(400).json({ error: 'Text must be a string' });
    }

    console.log('Sending request to BERN2 with text:', text.substring(0, 100));

    // Make request to BERN2 API
    const response = await fetch("https://bern2.korea.ac.kr/plain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    console.log('BERN2 response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('BERN2 error response:', errorText);
      throw new Error(`BERN2 API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('BERN2 response received successfully');
    
    // Return the result
    res.status(200).json(data);

  } catch (error) {
    console.error("Error in handler:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
