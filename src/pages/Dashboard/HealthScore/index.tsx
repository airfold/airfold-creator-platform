import { motion } from 'framer-motion';
import Badge from '../../../components/Badge';
import ProgressBar from '../../../components/ProgressBar';
import { getCurrentCreator } from '../../../data/creators';

export default function HealthScore() {
  const creator = getCurrentCreator();
  const score = creator.healthScore;

  const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444';
  const status = score >= 80 ? 'Eligible' : score >= 50 ? 'At Risk' : 'Under Review';
  const statusColor: 'green' | 'amber' | 'red' = score >= 80 ? 'green' : score >= 50 ? 'amber' : 'red';

  const metrics = {
    sameIPPercent: creator.flags.includes('same_ip_cluster') ? 42 : 3,
    bounceRate: creator.flags.includes('high_bounce_rate') ? 68 : 22,
    avgSessionTime: creator.flags.includes('low_session_time') ? '0:18' : '4:32',
    rating: creator.rating,
    ratingCount: creator.ratingCount,
  };

  const ratingMeetsMinimum = metrics.rating >= 3.0 && metrics.ratingCount >= 15;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-af-deep-charcoal mb-0.5">Health Score</h1>
        <p className="text-sm text-af-medium-gray">{creator.appName} · Traffic quality and eligibility</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E5EA" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color: scoreColor }}>{score}</span>
            <span className="text-[10px] text-af-medium-gray">/ 100</span>
          </div>
        </div>

        <Badge label={status} color={statusColor} />
        <p className="text-xs text-af-medium-gray mt-2 text-center">
          {score >= 80
            ? "Your traffic looks healthy. You're eligible for full payouts."
            : score >= 50
              ? 'Some metrics need attention. Your account may be reviewed.'
              : 'Your account is under review due to suspicious patterns.'}
        </p>
      </motion.div>

      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
          <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">Traffic Quality Flags</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-af-medium-gray">Same IP Cluster</span>
                <span className={`text-sm font-semibold ${metrics.sameIPPercent > 20 ? 'text-danger' : 'text-success'}`}>
                  {metrics.sameIPPercent}%
                </span>
              </div>
              <ProgressBar value={metrics.sameIPPercent} max={100} showValue={false} color={metrics.sameIPPercent > 20 ? '#ef4444' : undefined} />
              <p className="text-xs text-af-medium-gray mt-1">
                {metrics.sameIPPercent > 20 ? 'High same-IP traffic detected' : 'Normal distribution'}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-af-medium-gray">Bounce Rate</span>
                <span className={`text-sm font-semibold ${metrics.bounceRate > 50 ? 'text-danger' : 'text-success'}`}>
                  {metrics.bounceRate}%
                </span>
              </div>
              <ProgressBar value={metrics.bounceRate} max={100} showValue={false} color={metrics.bounceRate > 50 ? '#ef4444' : undefined} />
              <p className="text-xs text-af-medium-gray mt-1">
                {metrics.bounceRate > 50 ? 'Users leaving quickly' : 'Good engagement'}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-af-medium-gray">Avg Session Time</span>
                <span className={`text-sm font-semibold ${metrics.avgSessionTime < '1:00' ? 'text-danger' : 'text-success'}`}>
                  {metrics.avgSessionTime}
                </span>
              </div>
              <div className="h-2 bg-af-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(parseFloat(metrics.avgSessionTime.replace(':', '.')) / 10 * 100, 100)}%`,
                    background: metrics.avgSessionTime < '1:00' ? '#ef4444' : '#BD295A',
                  }}
                />
              </div>
              <p className="text-xs text-af-medium-gray mt-1">
                {metrics.avgSessionTime < '1:00' ? 'Very short sessions' : 'Healthy session lengths'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4">
          <h3 className="text-base font-semibold text-af-deep-charcoal mb-3">App Rating Status</h3>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${
              ratingMeetsMinimum ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
            }`}>
              {metrics.rating > 0 ? metrics.rating.toFixed(1) : 'N/A'}
            </div>
            <div>
              <p className="text-sm font-medium text-af-deep-charcoal">
                {metrics.ratingCount > 0 ? `${metrics.ratingCount} ratings` : 'No ratings yet'}
              </p>
              <p className="text-xs text-af-medium-gray">Min: 3.0 from 15+ ratings</p>
            </div>
          </div>

          {ratingMeetsMinimum ? (
            <div className="bg-green-50 border border-success/20 rounded-xl p-3 text-xs text-success">
              Your rating meets the minimum requirement.
            </div>
          ) : (
            <div className="bg-orange-50 border border-warning/20 rounded-xl p-3 text-xs text-warning">
              {metrics.ratingCount < 15
                ? `Need ${15 - metrics.ratingCount} more ratings to qualify.`
                : 'Rating is below the 3.0 minimum.'}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-af-light-gray">
            <h4 className="text-xs font-medium text-af-medium-gray mb-2">Active Flags</h4>
            {creator.flags.length === 0 ? (
              <p className="text-sm text-success">No flags — you're in good standing.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {creator.flags.map(flag => (
                  <Badge key={flag} label={flag.replace(/_/g, ' ')} color="red" />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-af-light-gray">
            <h4 className="text-xs font-medium text-af-medium-gray mb-1">Eligibility</h4>
            <div className={`text-base font-bold ${score >= 80 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-danger'}`}>
              {status}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
