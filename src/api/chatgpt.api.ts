import { API_ENTPOINTS } from "./endpoints";
import axiosInstance from "./axios";

export const fetchChatResponse = async (
  data: { role: string; content: string }[]
) => {
  try {
    const response = await axiosInstance.post(API_ENTPOINTS.completionURL, {
      messages: data,
      model: "gpt-4o",
      max_tokens: 512,
      stream: false,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    throw new Error(error.response.data.message || "Failed to fetch response.");
  }
};
