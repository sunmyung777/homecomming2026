import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, className = '', children, fullScreen = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section 
      id={id}
      ref={ref}
      className={`relative w-full ${fullScreen ? 'min-h-screen' : 'py-24'} flex flex-col justify-center items-center px-6 md:px-12 overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};