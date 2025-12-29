import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Calendar } from 'lucide-react';

interface PlaygroundNavProps {
    activeTab: 'insiders' | 'timeline';
    onTabChange: (tab: 'insiders' | 'timeline') => void;
}

export const PlaygroundNav: React.FC<PlaygroundNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <span className="font-black text-lg text-accent-gold">
                        PLAYGROUND
                    </span>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1">
                        {/* Home - Link back to main page */}
                        <Link
                            to="/"
                            className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 text-brand-line/60 hover:text-brand-text"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden md:inline">Home</span>
                        </Link>

                        {/* 29th Insiders Tab */}
                        <button
                            onClick={() => onTabChange('insiders')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${activeTab === 'insiders'
                                    ? 'text-accent-gold bg-accent-gold/10'
                                    : 'text-brand-line/60 hover:text-brand-text'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            <span className="hidden md:inline">29th Insiders</span>
                        </button>

                        {/* Timeline Tab */}
                        <button
                            onClick={() => onTabChange('timeline')}
                            className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${activeTab === 'timeline'
                                    ? 'text-accent-gold bg-accent-gold/10'
                                    : 'text-brand-line/60 hover:text-brand-text'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden md:inline">Timeline</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
