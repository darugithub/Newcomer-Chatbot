const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbox");

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"
        ? `<p>${message}</p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

function bold(text){
    var bold = /\*\*(.*?)\*\*/gm;
    var html = text.replace(bold, '<strong>$1</strong>');            
    return html;
}
    

const handleChat = async () => {
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";
    chatInput.setAttribute("placeholder", "Enter a message...");

    // Append "Thinking..." message while waiting for response
    let botReply = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(botReply);

    // Send user message to Node.js backend
    try {
        let response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });


        let data = await response.json();
        if (response.ok) {
            const parsedResponse = bold(data.response);
            botReply.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${parsedResponse}</p>`;
        } else {
            botReply.innerHTML = `<span class="material-symbols-outlined">error</span><p>Error getting response</p>`;
        }
    } catch (error) {
        botReply.innerHTML = `<span class="material-symbols-outlined">error</span><p>Error getting response</p>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
};

// Event listeners for button click & Enter key
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleChat();
    }
});
