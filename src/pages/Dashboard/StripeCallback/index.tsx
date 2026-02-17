import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchConnectStatus } from '../../../services/api';

export default function StripeCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'verifying' | 'success' | 'timeout' | 'cancelled'>('verifying');

  useEffect(() => {
    // Check for cancellation/error params from Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') || params.get('cancelled') === 'true') {
      setStatus('cancelled');
      queryClient.invalidateQueries({ queryKey: ['payoutStatus'] });
      const timeoutId = setTimeout(() => navigate('/dashboard/earnings', { replace: true }), 2500);
      return () => clearTimeout(timeoutId);
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (cancelled) return;

      try {
        const result = await fetchConnectStatus();
        if (cancelled) return;
        if (result.onboarding_complete || result.details_submitted) {
          setStatus('success');
          // Invalidate cache so Earnings page picks up new status immediately
          queryClient.invalidateQueries({ queryKey: ['payoutStatus'] });
          timeoutId = setTimeout(() => navigate('/dashboard/earnings', { replace: true }), 1500);
          return;
        }
      } catch {
        if (cancelled) return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setStatus('timeout');
        queryClient.invalidateQueries({ queryKey: ['payoutStatus'] });
        timeoutId = setTimeout(() => navigate('/dashboard/earnings', { replace: true }), 2000);
        return;
      }

      timeoutId = setTimeout(poll, 2000);
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [navigate, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      {status === 'verifying' && (
        <>
          <div className="w-10 h-10 rounded-full border-3 border-af-light-gray border-t-af-tint animate-spin" />
          <p className="text-sm font-semibold text-af-deep-charcoal">Verifying your account...</p>
          <p className="text-xs text-af-medium-gray">This may take a few moments.</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-af-deep-charcoal">Account verified!</p>
          <p className="text-xs text-af-medium-gray">Redirecting to earnings...</p>
        </>
      )}
      {status === 'timeout' && (
        <>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-af-deep-charcoal">Verification pending</p>
          <p className="text-xs text-af-medium-gray">Stripe is still processing. Redirecting to earnings...</p>
        </>
      )}
      {status === 'cancelled' && (
        <>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-af-deep-charcoal">Setup cancelled</p>
          <p className="text-xs text-af-medium-gray">You can complete setup anytime from the Earnings page.</p>
        </>
      )}
    </div>
  );
}
