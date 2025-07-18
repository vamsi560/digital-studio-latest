// 📁 api/generate-ios.js

const formidable = require('formidable');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form data' });

    try {
      const screens = Array.isArray(files.screens) ? files.screens : [files.screens];
      const projectName = fields.projectName || 'ios-ui';

      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      const generatedFiles = {};
      for (let screen of screens) {
        const base64 = fs.readFileSync(screen.filepath, 'base64');
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64,
              mimeType: screen.mimetype,
            },
          },
          {
            text: `Generate SwiftUI code for this iOS screen. Include complete reusable component structure and project-level details like Info.plist and Package.swift.`
          },
        ]);

        const text = await result.response.text();
        generatedFiles[`ios-ui/screens/${screen.originalFilename}.swift`] = text;
      }

      // Add project-level files
      generatedFiles['ios-ui/Info.plist'] = `<plist version=\"1.0\">...</plist>`;
      generatedFiles['ios-ui/Package.swift'] = `// swift-tools-version:5.7\n...`;

      return res.status(200).json({ generatedFiles });
    } catch (e) {
      console.error('Generation error:', e);
      res.status(500).json({ error: 'Failed to generate iOS code.' });
    }
  });
};
