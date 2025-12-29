import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Info, Swords, Ticket, UserPlus, Heart, Gamepad2 } from 'lucide-react';

const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'ticket', label: 'Ticket', icon: Ticket },
    { id: 'register', label: 'Register', icon: UserPlus },
    { id: 'sponsors', label: 'Sponsors', icon: Heart },
];

export const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(navItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        // If not on home page, navigate home first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-brand-bg/95 backdrop-blur-sm border-b border-white/5'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection('hero')}
                        className="flex items-center gap-2"
                    >
                        <span className="font-black text-lg text-accent-gold">
                            INSIDERS 창립제
                        </span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id && location.pathname === '/';
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${isActive
                                            ? 'text-accent-gold bg-accent-gold/10'
                                            : 'text-brand-line/60 hover:text-brand-text'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}

                        {/* Playground Button - Distinct styling */}
                        <Link
                            to="/playground"
                            className={`ml-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 border ${location.pathname === '/playground'
                                    ? 'bg-accent-gold text-brand-bg border-accent-gold'
                                    : 'border-accent-gold/50 text-accent-gold hover:bg-accent-gold/10 hover:border-accent-gold'
                                }`}
                        >
                            <Gamepad2 className="w-4 h-4" />
                            <span>Playground</span>
                        </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center gap-1">
                        {navItems.slice(0, 3).map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id && location.pathname === '/';
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`p-2 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'text-accent-gold bg-accent-gold/10'
                                            : 'text-brand-line/50 hover:text-brand-text'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            );
                        })}
                        {/* Mobile Playground Button */}
                        <Link
                            to="/playground"
                            className={`p-2 rounded-lg transition-colors duration-200 border ${location.pathname === '/playground'
                                    ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/50'
                                    : 'border-accent-gold/30 text-accent-gold/70 hover:text-accent-gold'
                                }`}
                        >
                            <Gamepad2 className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
