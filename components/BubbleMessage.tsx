import { View, Text } from "react-native";

interface BubbleMessageProps {
  message: string;
  type: "user" | "bot"; // 📌 Se asegura de que `type` solo sea "user" o "bot"
}

export default function BubbleMessage({ message, type }: BubbleMessageProps) {
  return (
    <View className={`flex ${type === "user" ? "flex-row-reverse" : "flex-row"} justify-start items-center p-2 rounded-lg my-2`}>
      <Text className="text-2xl">
        {type === "user" ? "🙍‍♂️" : "🤖"}
      </Text>
      <Text className={`text-lg ${type === "user" ? "text-white bg-blue-500" : "text-black bg-gray-200"} p-2 rounded-lg`}>
        {message}
      </Text>
    </View>
  );
}
