import React, { useState } from "react";
import Groq from "groq-sdk";

import "../styles/Chatbot.scss";

const groq = new Groq({
  apiKey: import.meta.env.VITE_REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function Chatbot() {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      prompt: "AI Assistant",
      response: "How can I help you regarding your health and lifestyle today?"
    }
  ]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    // Prevent sending empty messages
    if (inputValue.trim() === "") {
      return;
    }

    const chatPrompt = `You: ${inputValue}`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional lifestyle doctor and nutritionist. provide evidence-based, and personalized health advice. Respond as if you're conducting a professional medical consultation, offering practical, actionable recommendations while maintaining a supportive tone. Keep responses very concise"
          },
          {
            role: "user",
            content: inputValue,
          },
        ],
        model: "llama3-8b-8192",
      });

      const responseContent =
        chatCompletion.choices[0]?.message?.content || "No response";

      const newChatMessage = {
        prompt: chatPrompt,
        response: responseContent,
      };

      setChatMessages([...chatMessages, newChatMessage]);
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      const errorMessage = "I apologize, but there was an error processing your request. Could you please try again?";
      const newChatMessage = {
        prompt: chatPrompt,
        response: errorMessage,
      };
      setChatMessages([...chatMessages, newChatMessage]);
    } finally {
      setInputValue("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="app-name">
        <h1>Lifestyle Chatbot</h1>
      </div>
      <div className="chat-container">
        <div className="chat">
          {chatMessages.map((message, index) => (
            <div key={index} className="chat-message">
              <div className="chat-prompt">{message.prompt}</div>
              <div className="chat-response">{message.response}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="searchBar-container">
        <div className="searchbar">
          <textarea
            className="search-input"
            placeholder="Enter your health and lifestyle query"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSend}
            disabled={inputValue.trim() === ""}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;