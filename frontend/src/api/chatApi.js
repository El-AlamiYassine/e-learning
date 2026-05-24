import axiosInstance from './axiosInstance';

export const sendMessageToChatbot = async (message) => {
  try {
    const response = await axiosInstance.post('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to chatbot', error);
    throw error;
  }
};
