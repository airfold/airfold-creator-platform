import { useMyApps } from '../hooks/useCreatorData';
import { useSelectedApp } from '../context/AppContext';
import { haptic } from '../utils/haptic';

export default function AppSelector() {
  const { data: apps } = useMyApps();
  const { selectedAppId, setSelectedAppId } = useSelectedApp();

  if (!apps || apps.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      <button
        onClick={() => { haptic(); setSelectedAppId(null); }}
        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
          selectedAppId === null
            ? 'bg-af-tint text-white border-af-tint'
            : 'bg-white text-af-medium-gray border-af-light-gray active:text-af-deep-charcoal'
        }`}
      >
        All Apps
      </button>
      {apps.map(app => (
        <button
          key={app.id}
          onClick={() => { haptic(); setSelectedAppId(app.id); }}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            selectedAppId === app.id
              ? 'bg-af-tint text-white border-af-tint'
              : 'bg-white text-af-medium-gray border-af-light-gray active:text-af-deep-charcoal'
          }`}
        >
          {app.name}
        </button>
      ))}
    </div>
  );
}
