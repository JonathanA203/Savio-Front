import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { apiFetch } from '../services/api'; 

// Función para generar un UUID v4 rápido en el frontend para la sesión del chat
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function ChatBot() {
  const [sessionId] = useState(generateUUID()); // Genera un ID único para esta sesión de chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Soy SAVIO, tu asistente virtual. ¿En qué te puedo ayudar hoy con la gestión de tus colaboradores o ventas?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // 1. Limpieza de entrada y prevención de mensajes vacíos
    const cleanMessage = inputValue.trim();
    if (!cleanMessage) return;

    // 2. Agregamos el mensaje del usuario a la UI
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: cleanMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 3. Petición POST al endpoint del LLM
      const response = await apiFetch('/api/Llm/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: cleanMessage,
          sessionId: sessionId
        })
      });

      // 4. Extraemos exclusivamente la propiedad "response" de contentData
      if (response.contentData && response.contentData.response) {
        const newBotMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: response.contentData.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, newBotMessage]);
      } else {
        throw new Error("Respuesta del bot vacía o con formato incorrecto.");
      }

    } catch (err) {
      // Manejo de errores visual para el usuario
      const errorBotMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorBotMessage]);
      console.error("Error en ChatBot:", err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Verificamos explícitamente que no esté vacío antes de disparar el envío
      if (inputValue.trim()) {
        handleSendMessage(e);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.botAvatarContainer}>
          <span style={styles.botEmoji}>🤖</span>
        </div>
        <div>
          <h2 style={styles.headerTitle}>SAVIO Assistant</h2>
          <span style={styles.statusDot}></span>
          <span style={styles.statusText}>En línea</span>
        </div>
      </div>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={msg.id} style={{ ...styles.messageRow, justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
              {isBot && (
                <div style={styles.avatarSmall}>🤖</div>
              )}
              <div style={{ 
                ...styles.bubble, 
                ...(isBot ? styles.bubbleBot : styles.bubbleUser),
                ...(msg.isError ? { border: '1px solid #d32f2f', backgroundColor: '#ffebee' } : {}) 
              }}>
                <p style={{ ...styles.messageText, color: msg.isError ? '#d32f2f' : 'inherit' }}>
                  {msg.text}
                </p>
                <span style={styles.timestamp}>{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
            <div style={styles.avatarSmall}>🤖</div>
            <div style={{ ...styles.bubble, ...styles.bubbleBot, padding: '15px 20px' }}>
              <div style={styles.typingIndicator}>
                <span style={styles.dot}></span>
                <span style={styles.dot}></span>
                <span style={styles.dot}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <form onSubmit={handleSendMessage} style={styles.form}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje para SAVIO..."
            style={styles.textArea}
            rows={1}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            style={{ 
              ...styles.sendButton, 
              opacity: (inputValue.trim() && !isTyping) ? 1 : 0.5 
            }}
            disabled={!inputValue.trim() || isTyping}
          >
            <IoSend style={styles.sendIcon} />
          </button>
        </form>
        <p style={styles.disclaimer}>
          SAVIO puede cometer errores. Considera verificar la información importante.
        </p>
      </div>
    </div>
  );
}

// Estilos del Componente
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', backgroundColor: 'var(--white)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(164, 166, 165, 0.2)', overflow: 'hidden' },
  header: { padding: '15px 25px', backgroundColor: 'var(--sidebar-bg)', display: 'flex', alignItems: 'center', gap: '15px' },
  botAvatarContainer: { width: '45px', height: '45px', backgroundColor: 'var(--white)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' },
  headerTitle: { margin: 0, color: 'var(--white)', fontSize: '1.2rem' },
  statusDot: { display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#04C727', borderRadius: '50%', marginRight: '5px' },
  statusText: { color: 'var(--white)', fontSize: '0.8rem', opacity: 0.8 },
  messagesContainer: { flex: 1, padding: '25px', overflowY: 'auto', backgroundColor: '#F7F8FA', display: 'flex', flexDirection: 'column', gap: '20px' },
  messageRow: { display: 'flex', alignItems: 'flex-end', gap: '10px' },
  avatarSmall: { width: '30px', height: '30px', backgroundColor: 'var(--white)', border: '1px solid #E6E6E6', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', marginBottom: '2px' },
  bubble: { maxWidth: '70%', padding: '12px 18px', position: 'relative' },
  bubbleBot: { backgroundColor: 'var(--white)', color: 'var(--text-dark)', borderRadius: '18px 18px 18px 4px', border: '1px solid #E6E6E6', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
  bubbleUser: { backgroundColor: 'var(--primary)', color: 'var(--white)', borderRadius: '18px 18px 4px 18px' },
  messageText: { margin: 0, fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' },
  timestamp: { display: 'block', fontSize: '0.7rem', marginTop: '8px', opacity: 0.7, textAlign: 'right' },
  inputArea: { padding: '20px', backgroundColor: 'var(--white)', borderTop: '1px solid #E6E6E6' },
  form: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#F7F8FA', border: '1px solid #E6E6E6', borderRadius: '24px', padding: '8px 15px', transition: 'border-color 0.3s' },
  textArea: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', resize: 'none', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text-dark)', padding: '10px 0' },
  sendButton: { backgroundColor: 'var(--primary)', color: 'var(--white)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.3s, transform 0.2s' },
  sendIcon: { fontSize: '1.2rem', marginLeft: '2px' },
  disclaimer: { margin: '10px 0 0 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--secondary)' },
  typingIndicator: { display: 'flex', gap: '4px', alignItems: 'center' },
  dot: { width: '6px', height: '6px', backgroundColor: 'var(--secondary)', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out' }
};

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes pulse {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  ${styles.typingIndicator} span:nth-child(2) { animation-delay: 0.2s; }
  ${styles.typingIndicator} span:nth-child(3) { animation-delay: 0.4s; }
`;
document.head.appendChild(styleSheet);