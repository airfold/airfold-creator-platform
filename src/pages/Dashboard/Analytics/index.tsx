import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { getCurrentCreator } from '../../../data/creators';

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E5EA',
  borderRadius: '12px',
  color: '#1A1A1A',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
};

export default function Analytics() {
  const creator = getCurrentCreator();
  const currentQAU = creator.weeklyQAU[7];

  const dauData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    dau: Math.round(currentQAU * (0.3 + Math.random() * 0.4) * (1 + Math.sin(i / 5) * 0.2)),
  }));

  const qauVsUnique = creator.weeklyQAU.map((qau, i) => ({
    week: `W${i + 1}`,
    qau,
    uniqueUsers: Math.round(qau * (1.4 + Math.random() * 0.3)),
  }));

  const retentionData = [
    { week: 'Week 1', retention: 100 },
    { week: 'Week 2', retention: 68 },
    { week: 'Week 3', retention: 52 },
    { week: 'Week 4', retention: 41 },
  ];

  const sessionData = [
    { range: '0-1m', count: 120 },
    { range: '1-3m', count: 280 },
    { range: '3-5m', count: 340 },
    { range: '5-10m', count: 190 },
    { range: '10m+', count: 70 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-af-deep-charcoal mb-1">Analytics</h1>
        <p className="text-af-medium-gray">Deep dive into your app's performance</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-af-deep-charcoal mb-1">Daily Active Users (Last 30 Days)</h3>
        <p className="text-sm text-af-medium-gray mb-4">Unique users engaging with your app daily</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dauData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
            <XAxis dataKey="day" stroke="#8E8E93" fontSize={11} />
            <YAxis stroke="#8E8E93" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <defs>
              <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BD295A" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#BD295A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="dau" stroke="#BD295A" strokeWidth={2} fill="url(#dauGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-1">QAU vs Total Unique Users</h3>
          <p className="text-sm text-af-medium-gray mb-4">How many unique users qualify as QAU</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={qauVsUnique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={11} />
              <YAxis stroke="#8E8E93" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="uniqueUsers" name="Unique Users" fill="#E5E5EA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qau" name="QAU" fill="#BD295A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-1">Retention Curve</h3>
          <p className="text-sm text-af-medium-gray mb-4">User retention across weeks</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="week" stroke="#8E8E93" fontSize={11} />
              <YAxis stroke="#8E8E93" fontSize={11} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="retention" stroke="#22c55e" strokeWidth={3} dot={{ r: 5, fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-af-deep-charcoal mb-1">Session Duration</h3>
          <p className="text-sm text-af-medium-gray mb-4">Distribution of user session lengths (sessions under 1 min do not count toward QAU)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis dataKey="range" stroke="#8E8E93" fontSize={11} />
              <YAxis stroke="#8E8E93" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#E8739F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
