// This is your serverless function that will act as a proxy.
// It securely handles your API key on the server-side.

exports.handler = async function(event, context) {
    // Your API keys should be stored as environment variables in your Netlify dashboard
    // for security. We'll access them here.
    const generalApiKey = process.env.GEMINI_API_KEY;
    const mealApiKey = process.env.GEMINI_MEAL_API_KEY;

    // Get the type of API call from the request body
    const { prompt, type } = JSON.parse(event.body);

    // Choose the appropriate API key
    const apiKey = type === 'meal' ? mealApiKey : generalApiKey;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API key is not configured." }),
        };
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (!response.ok) {
            // Forward the error from the Gemini API
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify(errorData),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Error in serverless function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An internal server error occurred." }),
        };
    }
};
