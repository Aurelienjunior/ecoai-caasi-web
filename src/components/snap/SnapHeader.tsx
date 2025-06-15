
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SnapHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 flex items-center gap-4 border-b">
            <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Snap your waste</h1>
        </header>
    );
};

export default SnapHeader;
