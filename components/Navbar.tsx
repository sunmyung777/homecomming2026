import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Info, Swords, Ticket, UserPlus, Heart, Calendar } from 'lucide-react';

const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'ticket', label: 'Ticket', icon: Ticket },
    { id: 'register', label: 'Register', icon: UserPlus },
    { id: 'timeline', label: '29th insiders', icon: Calendar },
    // { id: 'sponsors', label: 'Sponsors', icon: Heart },
];

export const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Detect active section
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
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-brand-bg/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-brand-bg/50'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection('hero')}
                        className="flex items-center gap-2 group"
                    >
                        <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-goldLight">
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
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 group ${isActive
                                        ? 'text-accent-gold'
                                        : 'text-brand-line/70 hover:text-brand-text'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-accent-gold' : 'group-hover:text-accent-gold/60'}`} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-accent-gold/10 rounded-lg -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Navigation - Compact */}
                    <div className="flex md:hidden items-center gap-1">
                        {navItems.slice(0, 4).map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                        ? 'text-accent-gold bg-accent-gold/10'
                                        : 'text-brand-line/60 hover:text-brand-text'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};
