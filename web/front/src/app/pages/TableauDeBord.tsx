import { useEffect, useMemo, useState } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Activity, Clock, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  getDoctorDashboardOverview,
  getDoctorRecentECGs,
  getDoctorDistributionChart,
} from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const PRIMARY = '#534AB7';
const DANGER = '#E24B4A';
const AMBER = '#EF9F27';
const TEAL = '#1D9E75';
const INDIGO = '#6366F1';
const ROSE = '#F43F5E';
const CYAN = '#06B6D4';
const CHART_COLORS = [PRIMARY, DANGER, AMBER, TEAL, INDIGO, ROSE, CYAN];

type Overview = {
  receivedToday: number;
  pendingAnalyses: number;
};

type RecentECG = {
  id: string;
  patient: string;
  age: number | null;
  date: string;
  statut: string;
  type: string;
  urgent: boolean;
};

type DistributionChart = {
  labels: string[];
  values: number[];
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
    <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
    {label}
  </span>
);

export default function TableauDeBord() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<Overview>({
    receivedToday: 0,
    pendingAnalyses: 0,
  });

  const [ecgRecents, setEcgRecents] = useState<RecentECG[]>([]);
  const [distributionChart, setDistributionChart] = useState<DistributionChart>({
    labels: [],
    values: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          overviewRes,
          recentRes,
          distributionRes,
        ] = await Promise.all([
          getDoctorDashboardOverview(),
          getDoctorRecentECGs(),
          getDoctorDistributionChart(),
        ]);

        setOverview(overviewRes);
        setEcgRecents(recentRes);
        setDistributionChart(distributionRes);
      } catch (error) {
        console.error('Erreur chargement dashboard médecin :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statsCards = useMemo(() => [
    {
      title: "ECG reçus aujourd'hui",
      value: String(overview.receivedToday),
      icon: Activity,
      trend: { value: '+0%', isPositive: true },
      color: 'var(--primary)',
      bgColor: '#EEF2FF',
    },
    {
      title: 'Analyses en attente',
      value: String(overview.pendingAnalyses),
      icon: Clock,
      trend: { value: '+0', isPositive: false },
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
  ], [overview]);

  const doughnutData = useMemo(() => ({
    labels: distributionChart.labels,
    datasets: [
      {
        data: distributionChart.values,
        backgroundColor: CHART_COLORS,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [distributionChart]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { 
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context: any) => ` ${context.label}: ${context.raw}%`
            }
        }
    },
  } as const;

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-end">
            <div>
            <h1
                className="text-4xl mb-1"
                style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}
            >
                Bonjour Dr. {user?.prenom} 👋
            </h1>
            <p
                style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                textTransform: 'capitalize',
                }}
            >
                {today}
            </p>
            </div>
            {loading && (
            <div className="text-sm px-4 py-2 rounded-lg bg-gray-100 animate-pulse" style={{ color: 'var(--text-secondary)' }}>
                Mise à jour...
            </div>
            )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: stat.bgColor }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-3xl font-bold leading-none mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {stat.title}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{ 
                        background: stat.trend.isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: stat.trend.isPositive ? 'var(--success)' : '#F59E0B' 
                    }}
                  >
                    {stat.trend.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {stat.trend.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Répartition des diagnostics */}
            <Card className="md:col-span-1" style={{ borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader className="pb-2">
                    <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '17px' }}>
                        Répartition des diagnostics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ height: '200px', position: 'relative' }} className="mb-6">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {/* Centre vide ou icône subtile */}
                        </div>
                    </div>
                    <div className="space-y-2.5">
                        {distributionChart.labels.map((label, index) => {
                            const color = CHART_COLORS[index % CHART_COLORS.length];
                            const value = distributionChart.values[index] ?? 0;
                            return (
                                <div key={label} className="flex items-center justify-between">
                                    <LegendDot color={color} label={label} />
                                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{value}%</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* ECG Récents */}
            <Card className="md:col-span-2" style={{ borderRadius: '20px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader className="pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '17px' }}>
                        ECG récents
                      </CardTitle>
                      <CardDescription style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Derniers dossiers reçus
                      </CardDescription>
                    </div>
                    <Link to="/ecg-recus">
                      <Button variant="outline" size="sm" style={{ borderRadius: '10px', borderColor: 'var(--border-color)', fontSize: '12px' }}>
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                    {ecgRecents.length === 0 ? (
                      <div className="p-12 text-center">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-10" />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Aucun ECG récent.
                        </p>
                      </div>
                    ) : (
                      ecgRecents.map((ecg) => (
                        <div
                          key={ecg.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: '#F0F0FF' }}
                            >
                              <Activity className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                  {ecg.patient}
                                </p>
                              </div>
                              <p className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {ecg.date} • {ecg.age ?? '--'} ans
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge
                              style={{
                                background: ecg.statut === 'Normal' ? '#E8F5F2' : (ecg.statut === 'Anormal' ? '#FEE2E2' : '#F3F4F6'),
                                color: ecg.statut === 'Normal' ? 'var(--accent-ai)' : (ecg.statut === 'Anormal' ? 'var(--error)' : 'var(--text-secondary)'),
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '3px 10px',
                              }}
                            >
                              {ecg.statut.toUpperCase()}
                            </Badge>
                            <Link to={`/ecg-analysis/${ecg.id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </MedecinLayout>
  );
}