const express = require('express');
const { DeepL, AI_Fairness_360, prisma } = require('./services');
const authenticateJWT = require('./auth');

const app = express();
app.use(express.json());

app.post('/api/indigenous-ritual', authenticateJWT, async (req, res) => {
  const { tradition, language } = req.body;
  const ritual = await prisma.ritual.findFirst({ where: { tradition } });
  const translated = await DeepL.translate(ritual.description, language);
  const elderApproval = await fetchElderApproval(ritual);
  const safetyCheck = await AI_Fairness_360.analyze(ritual, { decolonized: true });
  res.json({ ...ritual, description: translated, elderApproved: elderApproval, safety: safetyCheck });
});

app.post('/api/indigenous-translation', authenticateJWT, async (req, res) => {
  const { text, language } = req.body;
  const translated = await DeepL.translate(text, language);
  const elderApproval = await fetchElderApproval({ text: translated, language });
  res.json({ translated, approved: elderApproval });
});

app.listen(3000, () => console.log('Server running on port 3000'));
