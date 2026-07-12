import React, { useState, useEffect } from 'react';
import { 
  IoPeopleOutline, 
  IoPricetagOutline, 
  IoChatbubblesOutline, 
  IoCashOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import { apiFetch } from '../services/api';

const COLORS = ['#04C727', '#113321', '#A4A6A5', '#3B82F6', '#F8C134', '#E63946', '#8338EC', '#FFB703'];

export default function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para la data procesada incluyendo las nuevas métricas
  const [dashboardData, setDashboardData] = useState({
    activeUsers: 0,
    totalUsers: 0,
    chatUsagePercentage: '0%',
    totalSalesCount: 0,
    totalEarnings: 0,
    barData: [],
    pieData: []
  });

  useEffect(() => {
    fetchDashboardContext();
  }, []);

  const fetchDashboardContext = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiFetch('/api/Admin/company/context', {
        method: 'GET'
      });
      
      // Ahora contentData es un objeto que agrupa la información
      const data = response.contentData || {};
      const salesArray = data.salesData || [];
      const activeUsers = data.activeUsers || 0;
      const totalUsers = data.totalRegisterUsers || 0;

      // Cálculo dinámico del Chat Usage (Activos / Totales * 100)
      let chatUsage = '0%';
      if (totalUsers > 0) {
        const percentage = Math.round((activeUsers / totalUsers) * 100);
        chatUsage = `${percentage}%`;
      }
      
      processData(salesArray, activeUsers, totalUsers, chatUsage);
      
    } catch (err) {
      console.error("Error al cargar el contexto del dashboard:", err);
      setError('No se pudo cargar la información del panel.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función núcleo que transforma el JSON del backend en formato Recharts
  const processData = (salesArray, activeUsers, totalUsers, chatUsage) => {
    let sumEarnings = 0;
    const dailyMap = {};
    const productMap = {};

    salesArray.forEach(sale => {
      // 1. Sumatoria global de ingresos
      sumEarnings += sale.total;

      // 2. Agrupación por Día (Para gráfica de Barras)
      const dateObj = new Date(sale.saleDate);
      const day = dateObj.getDate().toString(); 
      dailyMap[day] = (dailyMap[day] || 0) + sale.total; 

      // 3. Agrupación por Producto (Para gráfica de Pastel)
      const prodName = sale.product || 'Desconocido';
      productMap[prodName] = (productMap[prodName] || 0) + 1; 
    });

    // Transformamos los diccionarios en los arrays que pide Recharts
    const finalBarData = Object.keys(dailyMap)
      .map(key => ({ name: key, sales: dailyMap[key] }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    const finalPieData = Object.keys(productMap)
      .map(key => ({ name: key, value: productMap[key] }));

    setDashboardData({
      activeUsers: activeUsers,
      totalUsers: totalUsers,
      chatUsagePercentage: chatUsage,
      totalSalesCount: salesArray.length,
      totalEarnings: sumEarnings,
      barData: finalBarData,
      pieData: finalPieData
    });
  };

  // Formateador de moneda para la tarjeta y tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Overview</h1>
        <button style={styles.refreshBtn} onClick={fetchDashboardContext} disabled={isLoading}>
          <IoRefreshOutline style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {/* 1. Sección de Tarjetas Superiores */}
      <div style={styles.cardsGrid}>
        <StatCard 
          title="Active Collaborators" 
          value={isLoading ? '...' : dashboardData.activeUsers.toLocaleString()} 
          subtitle={`Total Users: ${isLoading ? '...' : dashboardData.totalUsers.toLocaleString()}`}
          icon={IoPeopleOutline} 
          color="#113321" 
        />
        <StatCard 
          title="Sales" 
          value={isLoading ? '...' : dashboardData.totalSalesCount.toLocaleString()} 
          icon={IoPricetagOutline} 
        />
        <StatCard 
          title="Chat Usage" 
          value={isLoading ? '...' : dashboardData.chatUsagePercentage} 
          subtitle="This month"
          icon={IoChatbubblesOutline} 
        />
        <StatCard 
          title="Earning" 
          value={isLoading ? '...' : formatCurrency(dashboardData.totalEarnings)} 
          icon={IoCashOutline} 
          color="#113321"
        />
      </div>

      {/* 2. Sección de Gráficas */}
      <div style={styles.chartsGrid}>
        
        {/* Gráfica de Barras (Total Sales) */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Total Sales (Revenue per day)</h3>
          <div style={{ height: 300, width: '100%' }}>
            {isLoading ? (
              <div style={styles.loadingCharts}>Calculando métricas...</div>
            ) : dashboardData.barData.length === 0 ? (
              <div style={styles.loadingCharts}>No hay ventas registradas</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={dashboardData.barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E6E6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(4, 199, 39, 0.1)'}} 
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    labelFormatter={(label) => `Día ${label}`}
                  />
                  <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfica de Pastel (Sale by product) */}
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Sale by product (Volume)</h3>
          <div style={{ height: 300, width: '100%' }}>
            {isLoading ? (
              <div style={styles.loadingCharts}>Agrupando productos...</div>
            ) : dashboardData.pieData.length === 0 ? (
              <div style={styles.loadingCharts}>No hay productos registrados</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dashboardData.pieData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Ventas']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, color: 'var(--sidebar-bg)', fontSize: '1.8rem', fontWeight: 'bold' },
  refreshBtn: { background: 'none', border: 'none', color: 'var(--primary)', fontSize: '1.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  errorBox: { backgroundColor: '#ffebee', color: '#d32f2f', padding: '15px', borderRadius: '8px', fontSize: '0.95rem' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' },
  chartBox: { backgroundColor: 'var(--white)', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(164, 166, 165, 0.2)' },
  chartTitle: { margin: '0 0 20px 0', color: 'var(--text-dark)', fontSize: '1.2rem', fontWeight: '600' },
  loadingCharts: { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--secondary)', fontStyle: 'italic' }
};