import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Info, Swords, Ticket, UserPlus, Calendar } from 'lucide-react';

const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'ticket', label: 'Ticket', icon: Ticket },
    { id: 'register', label: 'Register', icon: UserPlus },
    { id: 'timeline', label: '29th insiders', icon: Calendar },
];

export const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);

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
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
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
                            const isActive = activeSection === item.id;
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
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center gap-1">
                        {navItems.slice(0, 4).map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
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
                    </div>
                </div>
            </div>
        </nav>
    );
};
