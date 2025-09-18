import streamlit as st
import requests
import os

# --- Configuration ---
# The URL of your FastAPI backend.
# This allows the Streamlit UI to communicate with the chatbot logic.
# It defaults to localhost for local testing but can be overridden.
API_URL = os.getenv("CHATBOT_API_URL", "http://localhost:8000/chat")

# --- Streamlit Page Setup ---
# Set the title and icon that will appear in the browser tab.
st.set_page_config(
    page_title="Shelf Space AI",
    page_icon="📚",
    layout="centered"
)

st.title("📚 Shelf Space AI Chatbot")
st.caption("Your personal guide to the world of books")

# --- Session State Management ---
# This is the key to making the chat interface "remember" the conversation.
# Streamlit re-runs the script on every interaction, so we must store
# the conversation history and session ID in st.session_state.

# Initialize session_id to None. The API will create one for the first message.
if "session_id" not in st.session_state:
    st.session_state.session_id = None

# Initialize the list of messages to display in the chat UI.
if "messages" not in st.session_state:
    st.session_state.messages = []

# --- Chat Interface Logic ---

# Display all previous messages on each re-run.
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# This is the main input box at the bottom of the screen.
if prompt := st.chat_input("Ask me about a book..."):
    # 1. Add the user's message to the chat history and display it.
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # 2. Prepare the data to send to your FastAPI backend.
    payload = {
        "query": prompt,
        "session_id": st.session_state.session_id # Send the current session ID
    }

    # 3. Call the API and handle the response.
    with st.spinner("Thinking..."):
        try:
            # Make the POST request to your chatbot's API
            response = requests.post(API_URL, json=payload)
            response.raise_for_status()  # This will raise an error for bad responses (4xx or 5xx)
            
            data = response.json()
            ai_response = data.get("answer", "I seem to be at a loss for words.")
            
            # CRUCIAL: Update the session_id with the one from the API.
            # This ensures that follow-up questions continue the same conversation.
            st.session_state.session_id = data.get("session_id")

        except requests.exceptions.RequestException as e:
            ai_response = f"**Error:** I couldn't connect to the chatbot service. Please ensure it's running. \n\n*Details: {e}*"
        except Exception as e:
            ai_response = f"**An unexpected error occurred:** {e}"

    # 4. Add the AI's response to the chat history and display it.
    st.session_state.messages.append({"role": "assistant", "content": ai_response})
    with st.chat_message("assistant"):
        st.markdown(ai_response)

