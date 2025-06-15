
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
    const { profile } = useAuth();

    const getInitials = (name: string) => {
        if (!name) return "U";
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    return (
        <header className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Hi, {profile?.first_name || 'there'} <span role="img" aria-label="waving hand">👋</span></h1>
                    <p className="text-muted-foreground text-sm">Ready to manage your waste the smart way?</p>
                </div>
                <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <Avatar>
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                        <AvatarFallback>
                            {getInitials(profile?.first_name || '')}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
