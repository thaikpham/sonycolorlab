/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {VertexAI} = require('@google-cloud/vertexai');
const cors = require('cors')({origin: true});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.askGemini = onRequest({cors: true}, async (req, res) => {
  cors(req, res, async () => {
    try {
      // Initialize VertexAI
      const vertex_ai = new VertexAI({project: 'gen-lang-client-0152189587', location: 'us-central1'});
      const model = 'gemini-pro'; // Use the appropriate model name

      // Instantiate the model
      const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generation_config: {
          "max_output_tokens": 2048,
          "temperature": 0.2,
          "top_p": 1,
          "top_k": 32,
        },
      });

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).send('No prompt provided.');
      }

      const request = {
        contents: [{role: 'user', parts: [{text: prompt}]}],
      };
      
      logger.info("Sending request to Gemini:", {structuredData: true, request: request});

      // Generate content
      const resp = await generativeModel.generateContent(request);
      
      // Correctly extract the response text
      if (resp.response && resp.response.candidates && resp.response.candidates.length > 0 && resp.response.candidates[0].content && resp.response.candidates[0].content.parts && resp.response.candidates[0].content.parts.length > 0) {
        const text = resp.response.candidates[0].content.parts[0].text;
        logger.info("Successfully received response from Gemini.");
        res.status(200).send(text);
      } else {
        logger.error("Invalid response structure from Gemini API:", {structuredData: true, response: resp});
        res.status(500).send('Failed to get a valid response from the model.');
      }

    } catch (error) {
      logger.error("Error calling Gemini API:", error);
      res.status(500).send('Internal Server Error');
    }
  });
});
