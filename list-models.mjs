import { GoogleGenerativeAI } from '@google/generative-ai';

async function list() {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyB60--pdMWEBvh0lPdKfDO3Kxmb56zvLng');
  const models = await response.json();
  console.log(JSON.stringify(models.models?.map(m => m.name) || models, null, 2));
}
list();