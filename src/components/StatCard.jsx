import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = "var(--primary)" }) {
  return (
    <div style={styles.card}>
      <div style={styles.info}>
        <h3 style={styles.value}>{value}</h3>
        <p style={styles.title}>{title}</p>
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
      </div>
      <div style={{ ...styles.iconContainer, color: color }}>
        {Icon && <Icon />}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--white)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(164, 166, 165, 0.2)',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--text-dark)',
    margin: '0 0 5px 0',
  },
  title: {
    fontSize: '1rem',
    color: 'var(--secondary)',
    margin: 0,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--secondary)',
    marginTop: '5px',
  },
  iconContainer: {
    fontSize: '2.5rem',
    opacity: 0.8,
  }
};