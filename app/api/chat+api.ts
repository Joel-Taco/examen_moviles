import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env"; // Importar la API Key desde .env

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    // 📌 Obtener los mensajes enviados por el usuario
    const { messages } = await req.json();
    console.log("Mensajes recibidos:", messages);

    // 📌 Convertir los mensajes en un solo string para enviarlo a Gemini
    const prompt = messages.map((msg: any) => msg.content).join("\n");

    // 📌 Usar un modelo disponible
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" }); 

    // 📌 Enviar la solicitud a Gemini en el formato correcto
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const response = await result.response;

    // 📌 Obtener la respuesta generada
    const generatedText = response.text();

    console.log("Respuesta de Gemini:", generatedText);

    return new Response(
      JSON.stringify({ message: generatedText }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en la API de Gemini:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}