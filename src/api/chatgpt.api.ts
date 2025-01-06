import { API_ENTPOINTS } from "./endpoints";
import axiosInstance from "./axios";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

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
    const axiosError = error as AxiosError;
    const errorMessage =
      (axiosError.response?.data as ErrorResponse)?.message ||
      "Failed to fetch response.";
    console.error("Error fetching response from OpenAI:", errorMessage);
    throw new Error(errorMessage);
  }
};
