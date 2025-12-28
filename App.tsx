import React, { useState, useRef } from 'react';
import { Hero } from './components/Hero';
import { Explain } from './components/Explain';
import { Battle } from './components/Battle';
import { Ticket } from './components/Ticket';
import { Register } from './components/Register';
import { Sponsors } from './components/Sponsors';
import { Timeline } from './components/Timeline';
import { Navbar } from './components/Navbar';
import { School } from './types';

function App() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  const handleTicketSelect = (school: School) => {
    setSelectedSchool(school);
    // Smooth scroll to register section
    if (registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToRegister = () => {
    if (registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative w-full bg-brand-bg text-brand-text selection:bg-brand-mid selection:text-white">
      {/* School selection background overlay with film-like animation */}
      <div
        className={`fixed inset-0 pointer-events-none z-[5] transition-all duration-1000 ease-out ${selectedSchool === School.YONSEI
          ? 'bg-[#4B73A8]/[0.06] opacity-100'
          : selectedSchool === School.KOREA
            ? 'bg-[#A84B52]/[0.06] opacity-100'
            : 'opacity-0'
          }`}
        style={{
          background: selectedSchool === School.YONSEI
            ? 'linear-gradient(180deg, rgba(75,115,168,0.08) 0%, rgba(75,115,168,0.03) 50%, rgba(75,115,168,0.06) 100%)'
            : selectedSchool === School.KOREA
              ? 'linear-gradient(180deg, rgba(168,75,82,0.08) 0%, rgba(168,75,82,0.03) 50%, rgba(168,75,82,0.06) 100%)'
              : 'transparent'
        }}
      />

      <Navbar />
      <Hero onRegisterClick={scrollToRegister} />
      <Explain />
      <Battle />
      <Ticket onSelect={handleTicketSelect} />

      {/* Wrapper to attach ref for scrolling */}
      <div ref={registerRef}>
        <Register
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
        />
      </div>
      <Timeline />
      {/* <Sponsors /> */}
    </main>
  );
}

export default App;