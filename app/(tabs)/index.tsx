import { useState } from "react";
import { View, TextInput, Text, Button, FlatList } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";
import BubbleMessage from "@/components/BubbleMessage";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

export default function TabChat() {
  // 📌 Asegurar que `messages` siempre sea un array vacío inicialmente con valores válidos para `role`
  const [messages, setMessages] = useState<{ content: string; role: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // 📌 Crear mensaje del usuario
    const newMessage = { content: input, role: "user" as const };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // 📌 Enviar la consulta a Gemini
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: input }] }]
      });

      const response = await result.response;
      const aiMessage = { content: response.text(), role: "bot" as const };

      // 📌 Agregar la respuesta de Gemini al estado
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      // 📌 Mostrar mensajes en consola para depuración
      console.log("Mensajes actuales:", [...messages, newMessage, aiMessage]);
    } catch (error) {
      console.error("Error en Gemini:", error);
    }

    setInput(""); // 📌 Limpiar input después de enviar el mensaje
  };

  return (
    <View className="flex flex-col h-full p-4">
      <FlatList
        data={messages}
        renderItem={({ item }) =>
          item?.content && item?.role ? (
            <BubbleMessage message={item.content} type={item.role} />
          ) : null
        }
        keyExtractor={(_, index) => index.toString()} // 📌 Se asegura de que haya una clave única
      />
      <View className="flex flex-row w-full">
        <TextInput
          className="flex-1 border"
          placeholder="Escribe un mensaje..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Enviar" onPress={handleSubmit} />
      </View>
    </View>
  );
}
