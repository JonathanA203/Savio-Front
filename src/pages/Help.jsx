import React, { useState } from 'react';
import { IoSearchOutline, IoMailOutline } from 'react-icons/io5';

// Datos "quemados" (Mock Data) para las preguntas frecuentes
const faqData = [
  {
    id: 1,
    question: '¿Cómo genero un reporte?',
    answer: 'Ve a la pestaña "Reportes" y haz clic en el botón "Generar Reporte".'
  },
  {
    id: 2,
    question: '¿Dónde puedo ver mis colaboradores?',
    answer: 'En la sección "Collaborators", encontrarás una lista detallada con sus estados y roles.'
  },
  {
    id: 3,
    question: '¿Cómo funciona el chatbot?',
    answer: 'En la pestaña "Chat Bot", puedes hacer preguntas sobre tus datos en tiempo real y obtener asistencia rápida.'
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtro en tiempo real basado en lo que el usuario escribe
  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSupport = () => {
    alert('Lo sentimos, en este momento el soporte directo no se encuentra disponible. Estamos trabajando en ello.');
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentCard}>
        
        {/* Cabecera */}
        <h1 style={styles.title}>Centro de Ayuda</h1>
        <p style={styles.subtitle}>
          ¿Tienes dudas? Encuentra respuestas o contáctanos directamente.
        </p>

        {/* Barra de Búsqueda */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar una pregunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <IoSearchOutline style={styles.searchIcon} />
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <div style={styles.faqSection}>
          <h2 style={styles.sectionTitle}>Preguntas Frecuentes</h2>
          
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>{faq.question}</h3>
                <p style={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No se encontraron preguntas que coincidan con tu búsqueda.</p>
          )}
        </div>

        {/* Sección de Soporte (Bajo Construcción) */}
        <div style={styles.supportSection}>
          <h2 style={styles.supportTitle}>¿Necesitas más ayuda?</h2>
          <p style={styles.supportText}>
            Contáctanos directamente y te responderemos en menos de 24 horas.
          </p>
          <button style={styles.contactButton} onClick={handleContactSupport}>
            <IoMailOutline style={{ marginRight: '8px', fontSize: '1.2rem' }} />
            Contactar Soporte
          </button>
        </div>

      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
  },
  contentCard: {
    backgroundColor: 'var(--white)',
    width: '100%',
    maxWidth: '800px', // Limita el ancho para que no se estire demasiado en pantallas gigantes
    padding: '40px 50px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid rgba(164, 166, 165, 0.2)',
  },
  title: {
    color: 'var(--text-dark)',
    fontSize: '2rem',
    margin: '0 0 10px 0',
  },
  subtitle: {
    color: 'var(--text-dark)',
    fontSize: '1rem',
    marginBottom: '30px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F7F8FA', // Fondo gris ultra claro
    borderRadius: '25px',
    padding: '12px 20px',
    marginBottom: '40px',
    border: '1px solid #E6E6E6',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '1rem',
    color: 'var(--text-dark)',
  },
  searchIcon: {
    color: 'var(--secondary)',
    fontSize: '1.2rem',
  },
  faqSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    color: 'var(--text-dark)',
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  faqCard: {
    backgroundColor: '#F7F8FA',
    padding: '20px 25px',
    borderRadius: '12px',
    marginBottom: '15px',
  },
  faqQuestion: {
    margin: '0 0 8px 0',
    color: 'var(--text-dark)',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  faqAnswer: {
    margin: 0,
    color: 'var(--text-dark)',
    fontSize: '0.95rem',
  },
  noResults: {
    color: 'var(--secondary)',
    fontStyle: 'italic',
  },
  supportSection: {
    backgroundColor: '#EBF3FB', // Fondo azul claro amigable como en tu diseño
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  supportTitle: {
    margin: '0 0 10px 0',
    color: 'var(--text-dark)',
    fontSize: '1.2rem',
  },
  supportText: {
    margin: '0 0 20px 0',
    color: 'var(--text-dark)',
    fontSize: '0.95rem',
  },
  contactButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3B82F6', // Azul del diseño
    color: 'var(--white)',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.3s',
  }
};