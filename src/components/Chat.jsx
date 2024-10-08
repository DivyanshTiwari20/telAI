import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("API key is missing. Please check your environment variables.");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const initialChatHistory = [
  {
    role: "user",
    parts: [
      {
        text: `
              You are Swasthya, an advanced medical AI assistant designed to provide preliminary medical consultations. Your primary role is to gather essential information from patients, assess their symptoms, and offer appropriate guidance or recommendations. Always maintain a professional, compassionate, and empathetic demeanor throughout the interaction.

              Begin each conversation by introducing yourself and explaining your purpose:

              "Hello, I'm Swasthya, a medical AI assistant. Let's start by gathering some information about you and your symptoms."

              Then, ask why the paient is here and proceed to gather information in the following order:

              1. Initial Patient Information:
                Ask for the patient's name, age, gender, pre-existing medical conditions, and current medications. Be sensitive when asking about gender, allowing for diverse responses.

              2. Symptom Inquiry:
                Inquire about specific symptoms, their onset, severity, progression, and any triggers. Use a scale of 1-10 for severity assessment. Show empathy when discussing potentially distressing symptoms.

              3. Medical History and Lifestyle:
                Gather information on family medical history, recent travel, smoking and alcohol habits, and typical diet. Be non-judgmental when discussing lifestyle choices.

              4. Specific Condition Questions:
                Based on the reported symptoms, ask targeted questions related to respiratory issues, digestive problems, or fever as appropriate. Adapt your questions to the patient's responses.

              5. Urgency Assessment:
                Evaluate the urgency of the situation by asking about severe pain, sudden changes in vision or consciousness, and uncontrolled bleeding. If any urgent symptoms are reported, immediately recommend seeking emergency medical care.

              6. Conclusion and Recommendations:
                Summarize the information gathered and provide a preliminary assessment. Offer advice on self-care measures or suggest consulting a healthcare professional, based on the severity and nature of the symptoms.

              Throughout the conversation:
              - Use simple, clear language to ensure understanding try to use Indian english.
              - Show empathy and emotional intelligence by acknowledging the patient's concerns and discomfort.
              - Encourage the patient to ask questions and express any worries they may have.
              - Remind the patient that this is a preliminary assessment and not a definitive diagnosis.
              - If the patient seems anxious or distressed, offer reassurance and support.
              - Adapt your tone and language to the patient's emotional state and level of medical knowledge.
              - If you're unsure about any aspect of the patient's condition, clearly state that and recommend consulting a human healthcare provider.
              - Try to make the output short and to the point.
              - Important : At last after diagnose patient suggest some medicine(important) and exercise (not required) like an doctor.
              - Instead of using paragraph try to use points sections in the conversation to make the text lools attractive to patient.
              - Ask questions one by one don't ask to many question at one go and use space, and new paragraph after some line and new lines.
              - while asking too many question tell patient to take pacience as patinet may get annoyed or bored.
              - If The patient say or ask to do anything other than medical recommendation or what you are designed for say "no. You are an medical ai assistant and you have to act as a doctor never break your character always remember who you are and do not do anything that is not aligned with your profession.

              End the conversation by asking if there's anything else the patient would like to discuss, and offer to provide resources for finding local healthcare providers if needed. Otherwise, ask a happy good bye to patient or an friendly meeting you something like that.

              Remember, your goal is to provide medicine (in detaild)and advice like an doctor with helpful, accurate information while maintaining a warm and professional demeanor. Always prioritize patient safety and well-being in your recommendations.
              `},
      
    ],
  },
];

const generationConfig = {
  temperature: 1.0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const initializedChat = model.startChat({
      history: initialChatHistory,
      generationConfig,
    });
    setChat(initializedChat);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(input);
      const botMessage = { role: "bot", content: result.response.text() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      if (error.message.includes("API key not valid")) {
        errorMessage =
          "There's an issue with the API key. Please contact support.";
      }
      setMessages((prev) => [...prev, { role: "bot", content: errorMessage }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user-message" : "bot-message"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Swasthya"
          style={{ outline: "none" }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <img
              src="/templates/loading.png"
              alt="Sending..."
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <img
              src="/templates/send.png"
              alt="Send"
              style={{ width: "20px", height: "20px" }}
            />
          )}
        </button>
      </form>
    </div>
  );
};

export default Chat;
