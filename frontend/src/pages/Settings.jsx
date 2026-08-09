import GlassPanel from '../components/ui/GlassPanel';
import ThemeToggle from '../components/layout/ThemeToggle';
import useThemeStore from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { User, Palette, Shield, LogOut } from 'lucide-react';

/**
 * Settings page — theme toggle, profile info, preferences.
 */
const Settings = () => {
  const { theme } = useThemeStore();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>

      {/* Appearance */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5" style={{ color: '#a855f7' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Appearance
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Theme
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Currently using{' '}
              <span className="capitalize font-medium" style={{ color: 'var(--text-secondary)' }}>
                {theme}
              </span>{' '}
              mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </GlassPanel>

      {/* Profile details */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5" style={{ color: '#34d399' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Profile Details
          </h2>
        </div>
        
        {user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white uppercase"
                style={{ backgroundColor: user.avatarColor || '#f59e0b' }}
              >
                {user.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {user.email} &bull; Timezone: {user.timezone}
                </p>
              </div>
            </div>
            
            <Button
              variant="danger"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1.5 self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </Button>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No profile data available.
          </p>
        )}
      </GlassPanel>

      {/* Danger zone placeholder */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5" style={{ color: '#fb7185' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Danger Zone
          </h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Account deletion and data export coming in Phase 9.
        </p>
      </GlassPanel>
    </div>
  );
};

export default Settings;
