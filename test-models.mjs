import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyDoZ45sNzl1_b37oC2jWi8_Rz0JrHvQqME');
  try {
     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDoZ45sNzl1_b37oC2jWi8_Rz0JrHvQqME`);
     const data = await response.json();
     console.log(data.models.map(m => m.name).join('\n'));
  } catch (error) {
    console.error(error);
  }
}
run();