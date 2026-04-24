import { useEffect, useMemo, useState } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Activity, Users, AlertTriangle, Clock, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  getDoctorDashboardOverview,
  getDoctorRecentECGs,
  getDoctorAlerts,
  getDoctorWeeklyChart,
  getDoctorDistributionChart,
  getDoctorMonthlyTrendChart,
} from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const GRID_COLOR = 'rgba(0,0,0,0.06)';
const TICK_COLOR = '#94a3b8';
const PRIMARY = '#534AB7';
const DANGER = '#E24B4A';
const AMBER = '#EF9F27';
const TEAL = '#1D9E75';

type Overview = {
  receivedToday: number;
  abnormalDetected: number;
  activePatients: number;
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

type AlertItem = {
  id: string;
  patient: string;
  condition: string;
  time: string;
  severity: 'high' | 'medium';
};

type WeeklyChart = {
  labels: string[];
  normal: number[];
  abnormal: number[];
};

type DistributionChart = {
  labels: string[];
  values: number[];
};

type MonthlyTrendChart = {
  labels: string[];
  received: number[];
  abnormal: number[];
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
    abnormalDetected: 0,
    activePatients: 0,
    pendingAnalyses: 0,
  });

  const [ecgRecents, setEcgRecents] = useState<RecentECG[]>([]);
  const [alertes, setAlertes] = useState<AlertItem[]>([]);
  const [weeklyChart, setWeeklyChart] = useState<WeeklyChart>({
    labels: [],
    normal: [],
    abnormal: [],
  });
  const [distributionChart, setDistributionChart] = useState<DistributionChart>({
    labels: [],
    values: [],
  });
  const [monthlyTrendChart, setMonthlyTrendChart] = useState<MonthlyTrendChart>({
    labels: [],
    received: [],
    abnormal: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          overviewRes,
          recentRes,
          alertsRes,
          weeklyRes,
          distributionRes,
          monthlyRes,
        ] = await Promise.all([
          getDoctorDashboardOverview(),
          getDoctorRecentECGs(),
          getDoctorAlerts(),
          getDoctorWeeklyChart(),
          getDoctorDistributionChart(),
          getDoctorMonthlyTrendChart(),
        ]);

        setOverview(overviewRes);
        setEcgRecents(recentRes);
        setAlertes(alertsRes);
        setWeeklyChart(weeklyRes);
        setDistributionChart(distributionRes);
        setMonthlyTrendChart(monthlyRes);
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
      title: 'ECG anormaux détectés',
      value: String(overview.abnormalDetected),
      trend: { value: '-0%', isPositive: true },
      icon: AlertTriangle,
      color: 'var(--error)',
      bgColor: '#FEE2E2',
    },
    {
      title: 'Patients actifs',
      value: String(overview.activePatients),
      icon: Users,
      trend: { value: '+0%', isPositive: true },
      color: 'var(--accent-ai)',
      bgColor: '#E8F5F2',
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

  const barData = useMemo(() => ({
    labels: weeklyChart.labels,
    datasets: [
      {
        label: 'Normaux',
        data: weeklyChart.normal,
        backgroundColor: PRIMARY,
        borderRadius: 4,
        barPercentage: 0.6,
      },
      {
        label: 'Anormaux',
        data: weeklyChart.abnormal,
        backgroundColor: DANGER,
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  }), [weeklyChart]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: TICK_COLOR, font: { size: 11 } },
      },
      y: {
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { size: 11 }, stepSize: 4 },
        border: { display: false },
      },
    },
  } as const;

  const doughnutData = useMemo(() => ({
    labels: distributionChart.labels,
    datasets: [
      {
        data: distributionChart.values,
        backgroundColor: [PRIMARY, DANGER, AMBER, TEAL],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [distributionChart]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { display: false } },
  } as const;

  const lineData = useMemo(() => ({
    labels: monthlyTrendChart.labels,
    datasets: [
      {
        label: 'ECG reçus',
        data: monthlyTrendChart.received,
        borderColor: PRIMARY,
        backgroundColor: 'rgba(83,74,183,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: PRIMARY,
      },
      {
        label: 'Anormaux',
        data: monthlyTrendChart.abnormal,
        borderColor: DANGER,
        backgroundColor: 'rgba(226,75,74,0.06)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: DANGER,
      },
    ],
  }), [monthlyTrendChart]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: TICK_COLOR, font: { size: 10 } },
      },
      y: {
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { size: 10 } },
        border: { display: false },
      },
    },
  } as const;

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
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
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Chargement du tableau de bord...
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <Card
                  key={index}
                  style={{ borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: stat.bgColor }}
                      >
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>
                          {stat.value}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                          {stat.title}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-0.5 text-xs font-medium flex-shrink-0"
                        style={{ color: stat.trend.isPositive ? 'var(--success)' : 'var(--error)' }}
                      >
                        {stat.trend.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {stat.trend.value}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '15px' }}>
                    ECG reçus cette semaine
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Normaux vs Anormaux
                  </CardDescription>
                  <div className="flex gap-4 mt-1">
                    <LegendDot color={PRIMARY} label="Normaux" />
                    <LegendDot color={DANGER} label="Anormaux" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div style={{ height: '180px' }}>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader className="pb-3">
                  <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '15px' }}>
                    Répartition des diagnostics
                  </CardTitle>
                  <CardDescription style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    30 derniers jours
                  </CardDescription>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {distributionChart.labels.map((label, index) => {
                      const colors = [PRIMARY, DANGER, AMBER, TEAL];
                      const value = distributionChart.values[index] ?? 0;
                      return <LegendDot key={label} color={colors[index] || PRIMARY} label={`${label} ${value}%`} />;
                    })}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div style={{ height: '160px' }}>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
              <Card style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '15px' }}>
                        ECG récents
                      </CardTitle>
                      <CardDescription style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        Dernières analyses reçues
                      </CardDescription>
                    </div>
                    <Link to="/ecg-recus">
                      <Button variant="outline" size="sm" style={{ borderRadius: '8px', borderColor: 'var(--border-color)', fontSize: '12px' }}>
                        Voir tout
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ecgRecents.length === 0 ? (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Aucun ECG récent.
                      </p>
                    ) : (
                      ecgRecents.map((ecg) => (
                        <div
                          key={ecg.id}
                          className="flex items-center justify-between p-3 rounded-xl hover:shadow-sm transition-all"
                          style={{ background: 'var(--background)', border: '1px solid var(--border-color)' }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: '#EEF2FF' }}
                            >
                              <Activity className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                  {ecg.patient}
                                </p>
                                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                                  • {ecg.age ?? '--'} ans
                                </span>
                                {ecg.urgent && (
                                  <Badge
                                    className="text-xs flex-shrink-0"
                                    style={{
                                      background: 'var(--error)',
                                      color: 'white',
                                      fontSize: '10px',
                                      padding: '1px 6px',
                                    }}
                                  >
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {ecg.type} • {ecg.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <Badge
                              style={{
                                background: ecg.statut === 'Normal' ? '#E8F5F2' : '#FEE2E2',
                                color: ecg.statut === 'Normal' ? 'var(--accent-ai)' : 'var(--error)',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '11px',
                                padding: '2px 8px',
                              }}
                            >
                              {ecg.statut}
                            </Badge>
                            <Link to={`/analyse-ecg/${ecg.id}`}>
                              <Button size="sm" variant="ghost" style={{ borderRadius: '8px', padding: '4px 8px' }}>
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                <span className="text-xs">Voir</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Card style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" style={{ color: 'var(--error)' }} />
                      <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '15px' }}>
                        Alertes
                      </CardTitle>
                    </div>
                    <CardDescription style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      Attention immédiate requise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {alertes.length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Aucune alerte.
                        </p>
                      ) : (
                        alertes.map((alerte) => (
                          <div
                            key={alerte.id}
                            className="flex items-center justify-between p-3 rounded-xl"
                            style={{
                              background: alerte.severity === 'high' ? '#FEF2F2' : '#FEF3C7',
                              border: `1px solid ${alerte.severity === 'high' ? '#FCA5A5' : '#FCD34D'}`,
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: alerte.severity === 'high' ? 'var(--error)' : '#F59E0B' }}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                  {alerte.patient}
                                </p>
                                <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                                  {alerte.condition}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {alerte.time}
                              </span>
                              <Link to={`/analyse-ecg/${alerte.id}`}>
                                <Button
                                  size="sm"
                                  style={{
                                    background: alerte.severity === 'high' ? 'var(--error)' : '#F59E0B',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                  }}
                                >
                                  Examiner
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                  <CardHeader className="pb-3">
                    <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '15px' }}>
                      Tendance mensuelle
                    </CardTitle>
                    <div className="flex gap-4 mt-1">
                      <LegendDot color={PRIMARY} label="ECG reçus" />
                      <LegendDot color={DANGER} label="Anormaux" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div style={{ height: '130px' }}>
                      <Line data={lineData} options={lineOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </MedecinLayout>
  );
}