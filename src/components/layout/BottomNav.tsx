import { Home, Bot, History, Camera, CreditCard, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Picture', path: '/snap', icon: Camera },
  { name: 'Payment', path: '/payment', icon: CreditCard },
  // Removed Agent tab; only show available navigation options
  { name: 'History', path: '/history', icon: History },
  //   { name: 'Profile', path: '/profile', icon: User },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] md:hidden z-20">
      <div className="flex justify-around">
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
    </nav>
  );
};

export default BottomNav;
