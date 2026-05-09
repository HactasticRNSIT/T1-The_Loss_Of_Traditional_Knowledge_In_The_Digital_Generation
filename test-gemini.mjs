import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyDoZ45sNzl1_b37oC2jWi8_Rz0JrHvQqME');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 
    const result = await model.generateContent('Hi'); 
    console.log(result.response.text());
  } catch (error) {
    console.error("1.5-flash failed:", error.message);
  }

  try {
    const genAI = new GoogleGenerativeAI('AIzaSyDoZ45sNzl1_b37oC2jWi8_Rz0JrHvQqME');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); 
    const result = await model.generateContent('Hi'); 
    console.log(result.response.text());
  } catch (error) {
    console.error("1.5-pro failed:", error.message);
  }
}
run();