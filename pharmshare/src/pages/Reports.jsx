import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportData, getUser } from '../services/api';
import './Dashboard.css';
import './Reports.css';
import PdfService from '../services/PdfService';
import { toast } from 'react-hot-toast';

const Reports = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [loading, setLoading] = useState(true);
    const [biData, setBiData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!['admin', 'pharmacien'].includes(user?.role)) {
            toast.error("Accès non autorisé aux rapports.");
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const fetchBI = useCallback(async () => {
        try {
            const data = await getReportData('bi');
            setBiData(data);
        } catch (err){
            console.error('Erreur BI:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBI();
    }, [fetchBI]);

    const handleExport = async () => {
        setIsGenerating(true);
        const toastId = toast.loading('Génération du rapport PDF...');
        try {
            await PdfService.generatePdf('reports-content', `Rapport_Activite_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Rapport généré avec succès', { id: toastId });
        } catch {
            toast.error('Erreur lors de la génération du rapport', { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    const { kpis, monthly_stats, traffic_sources, transactions } = biData;
    const maxChartValue = Math.max(...monthly_stats.map(s => parseInt(s.value)), 1);

    const formatMoney = (val) => {
        return new Intl.NumberFormat('fr-FR').format(Math.round(val)) + ' F';
    };

    return (
        <div className="reports-page" id="reports-content">
            {/* Reports Header */}
            <div style={{ marginBottom: '2rem' }} className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Rapports & Statistiques</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Analysez vos performances et vos économies réelles.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={handleExport}
                            disabled={isGenerating}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            {isGenerating ? 'Génération...' : 'Exporter PDF Pro'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="print-header" style={{ display: 'none', marginBottom: '2rem' }}>
                <h1 style={{ color: '#10B981' }}>PharmShare - Bilan d'Activité</h1>
                <p>Date du rapport : {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            {/* Grille des rapports (KPIs) */}
            <div className="reports-grid">
                <div className="report-card">
                    <span className="report-card-title">Échange Total</span>
                    <span className="report-card-value">{formatMoney(kpis.total_exchange_value)}</span>
                    <span className="report-card-trend trend-positive">Valeur marchande</span>
                </div>
                <div className="report-card">
                    <span className="report-card-title">Économies Réalisées</span>
                    <span className="report-card-value">{formatMoney(kpis.economies)}</span>
                    <span className="report-card-trend trend-positive">Net estimé</span>
                </div>
                <div className="report-card">
                    <span className="report-card-title">Transactions</span>
                    <span className="report-card-value">{kpis.transactions_count}</span>
                    <span className="report-card-trend trend-positive">Flux total</span>
                </div>
                <div className="report-card">
                    <span className="report-card-title">Pertes Évitées</span>
                    <span className="report-card-value">{formatMoney(kpis.pertes_evitees)}</span>
                    <span className="report-card-trend trend-positive">Expirations sauvées</span>
                </div>
            </div>

            {/* Conteneur des graphiques */}
            <div className="charts-container">
                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Évolution des Demandes (6 Mois)</span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', width: '100%', height: '100%' }}>
                        <div className="simple-chart">
                            {monthly_stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="simple-chart-bar"
                                    style={{ height: `${(stat.value / maxChartValue) * 100}%` }}
                                    data-value={`${stat.value}`}
                                >
                                    <span className="simple-chart-label">{stat.label}</span>
                                </div>
                            ))}
                            {monthly_stats.length === 0 && <p style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>Pas encore de données historiques.</p>}
                        </div>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Sources d'Économie</span>
                    </div>
                    <div className="donut-chart-container">
                        <div style={{
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            background: `conic-gradient(#10B981 0% 45%, #60A5FA 45% 80%, #FBBF24 80% 100%)`,
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>100%</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="donut-legend">
                        {traffic_sources.map((source, idx) => (
                            <div key={idx} className="legend-item">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className="legend-color" style={{ backgroundColor: source.color }}></span>
                                    {source.name}
                                </div>
                                <span style={{ fontWeight: 600 }}>{source.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tableau de l'historique récent */}
            <div className="chart-card" style={{ height: 'auto', minHeight: 'auto' }}>
                <div className="chart-header">
                    <span className="chart-title">Dernières Transactions Terminées</span>
                </div>
                <div className="history-list">
                    {transactions.map(t => (
                        <div key={t.id} className="history-item">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="history-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="history-details">
                                    <span className="history-title">{t.item}</span>
                                    <span className="history-date">{new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • {t.type}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="history-amount amount-positive">{t.amount}</span>
                                <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{t.status}</div>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>Aucune transaction terminée répertoriée.</p>}
                </div>
            </div>
        </div>
    );
};

export default Reports;
