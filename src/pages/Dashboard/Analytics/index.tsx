import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { getCurrentCreator } from '../../../data/creators';

export default function Analytics() {
  const creator = getCurrentCreator();
  const currentQAU = creator.weeklyQAU[7];

  // DAU data (last 30 days)
  const dauData = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    dau: Math.round(currentQAU * (0.3 + Math.random() * 0.4) * (1 + Math.sin(i / 5) * 0.2)),
  }));

  // QAU vs unique users
  const qauVsUnique = creator.weeklyQAU.map((qau, i) => ({
    week: `W${i + 1}`,
    qau,
    uniqueUsers: Math.round(qau * (1.4 + Math.random() * 0.3)),
  }));

  // Retention curve
  const retentionData = [
    { week: 'Week 1', retention: 100 },
    { week: 'Week 2', retention: 68 },
    { week: 'Week 3', retention: 52 },
    { week: 'Week 4', retention: 41 },
  ];

  // Session duration
  const sessionData = [
    { range: '0-1m', count: 120 },
    { range: '1-3m', count: 280 },
    { range: '3-5m', count: 340 },
    { range: '5-10m', count: 190 },
    { range: '10m+', count: 70 },
  ];

  // Source breakdown
  const sourceData = [
    { name: 'Airfold Platform', value: creator.platformPercent, color: '#3b82f6' },
    { name: 'External Links', value: 100 - creator.platformPercent, color: '#8b5cf6' },
  ];

  // Platform vs external QAU value
  const platformVsExternal = creator.weeklyQAU.map((qau, i) => {
    const platformQAU = Math.round(qau * creator.platformPercent / 100);
    const externalQAU = qau - platformQAU;
    return {
      week: `W${i + 1}`,
      platform: Math.round(platformQAU * 1.5),
      external: externalQAU,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-white/40">Deep dive into your app's performance</p>
      </div>

      {/* DAU Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-1">Daily Active Users (Last 30 Days)</h3>
        <p className="text-sm text-white/40 mb-4">Unique users engaging with your app daily</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dauData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
            />
            <defs>
              <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="dau" stroke="#3b82f6" strokeWidth={2} fill="url(#dauGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QAU vs Unique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-1">QAU vs Total Unique Users</h3>
          <p className="text-sm text-white/40 mb-4">How many unique users qualify as QAU</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={qauVsUnique}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="uniqueUsers" name="Unique Users" fill="#ffffff20" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qau" name="QAU" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-1">Retention Curve</h3>
          <p className="text-sm text-white/40 mb-4">User retention across weeks</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} unit="%" />
              <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Session Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-1">Session Duration</h3>
          <p className="text-sm text-white/40 mb-4">Distribution of user session lengths</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Source Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-1">Traffic Source</h3>
          <p className="text-sm text-white/40 mb-4">Airfold platform vs external links</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Platform QAU value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-1">Platform QAU vs External QAU (Effective Value)</h3>
        <p className="text-sm text-white/40 mb-4">Platform users count as 1.5x value</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={platformVsExternal}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <Tooltip contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="platform" name="Platform (1.5x)" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="external" name="External (1.0x)" stackId="a" fill="#8b5cf680" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
