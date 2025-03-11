import React, { useState } from "react";
import Groq from "groq-sdk";

import "../styles/Chatbot.scss";
import { useEffect } from "react";

const groq = new Groq({
  apiKey: import.meta.env.VITE_REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function Chatbot() {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    handleSend();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() === "") {
      setInputValue(
        "Help me with health related suggestions, providing lifestyle feedbacks"
      );
    }

    const chatPrompt = `You: ${inputValue}`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
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
      const errorMessage = "Error fetching chat completion";
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
            placeholder="Enter your text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
