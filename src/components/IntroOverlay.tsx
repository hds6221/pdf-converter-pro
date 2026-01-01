import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroOverlayProps {
    onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const duration = 2000; // 2 seconds total load time
        const interval = 20; // Update every 20ms
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    // Small delay before triggering completion to ensure user sees 100%
                    setTimeout(onComplete, 200);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0C10]"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1], // Custom bezier for that sharp "curtain up" feel
            }}
        >
            <div className="w-full max-w-md px-8 text-center">
                {/* Brand / Logo Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold tracking-widest text-white">
                        PDF Converter <span className="text-[#66FCF1] glow-text">Pro</span>
                    </h1>
                </motion.div>

                {/* Progress Bar Container */}
                <div className="relative w-full h-1 bg-[#1F2833] rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#66FCF1] shadow-[0_0_10px_#66FCF1]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>

                {/* Counter Text */}
                <div className="mt-4 flex justify-between text-sm font-medium text-slate-500 font-mono">
                    <span>Loading assets...</span>
                    <span className="text-[#66FCF1]">{Math.round(progress)}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default IntroOverlay;
