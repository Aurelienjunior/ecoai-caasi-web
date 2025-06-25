import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '@/components/auth/LogoutButton';
import { Home, Bot, History, Camera, CreditCard, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const DashboardHeader = ({
  isProfileOpen,
  handleProfileClick,
}: {
  isProfileOpen: boolean;
  handleProfileClick: () => void;
}) => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  const getInitials = (full_name: string) => {
    if (!full_name) return 'U';
    const names = full_name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return full_name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Picture', path: '/snap', icon: Camera },
    { name: 'Payment', path: '/payment', icon: CreditCard },
    { name: 'History', path: '/history', icon: History },
  ];

  if (loading) return <p>Loading user...</p>;

  return (
    <header className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hi, {profile?.full_name || profile?.email || 'there'}{' '}
            <span role="img" aria-label="waving hand">
              👋
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Ready to manage your waste the smart way?
          </p>
        </div>
        <div className="p-2">
          <div className="max-md:hidden flex justify-around gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-20 ` +
                  (isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:bg-gray-100')
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 text-gray-600" />
          <LogoutButton />
          <button
            className="focus:outline-none"
            onClick={handleProfileClick}
            aria-label="Go to Profile"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
            }}
            tabIndex={0}
          >
            <Avatar>
              <AvatarImage
                src={profile?.avatar_url || ''}
                alt={profile?.full_name || 'User'}
              />
              <AvatarFallback>
                {getInitials(profile?.full_name || '')}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
