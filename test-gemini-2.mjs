import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyB60--pdMWEBvh0lPdKfDO3Kxmb56zvLng');
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
    const result = await model.embedContent('Hello!');
    console.log('SUCCESS: Embedding generated.');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}
testGemini();