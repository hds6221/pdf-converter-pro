import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';

const GlobalModal = () => {
    const { modalState, closeModal } = useModal();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (modalState) {
            setInputValue(''); // Reset input on open
            // Focus input if prompt
            if (modalState.type === 'prompt') {
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            }
        }
    }, [modalState]);

    const handleConfirm = () => {
        if (modalState?.type === 'prompt') {
            closeModal(inputValue);
        } else if (modalState?.type === 'confirm') {
            closeModal(true);
        } else {
            closeModal(undefined);
        }
    };

    const handleCancel = () => {
        if (modalState?.type === 'prompt') {
            closeModal(null);
        } else if (modalState?.type === 'confirm') {
            closeModal(false);
        } else {
            closeModal(undefined);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            // For alert, Esc closes it. For others, it cancels.
            handleCancel();
        }
    };

    if (!modalState) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={modalState.type === 'alert' ? handleConfirm : handleCancel}
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-sm bg-[#0B0C10] border border-[#1F2833] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#66FCF1] to-[#45A29E]" />

                    <div className="p-6">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-3 mb-4">
                            {modalState.type === 'alert' && <AlertTriangle className="text-[#66FCF1] w-6 h-6" />}
                            {modalState.type === 'confirm' && <HelpCircle className="text-[#66FCF1] w-6 h-6" />}
                            {modalState.type === 'prompt' && <AlertCircle className="text-[#66FCF1] w-6 h-6" />}
                            <h3 className="text-xl font-bold text-white">{modalState.title}</h3>
                        </div>

                        {/* Message */}
                        <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                            {modalState.message}
                        </p>

                        {/* Prompt Input */}
                        {modalState.type === 'prompt' && (
                            <div className="mb-6">
                                <input
                                    ref={inputRef}
                                    type={modalState.isSecret ? "password" : "text"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={modalState.placeholder}
                                    className="w-full bg-[#1F2833] border border-slate-700 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none placeholder:text-slate-600 transition-colors"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            {modalState.type !== 'alert' && (
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 px-4 rounded-lg border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-all"
                                >
                                    {modalState.cancelText}
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-2.5 px-4 rounded-lg bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] font-bold text-sm transition-all shadow-lg shadow-[#66FCF1]/20"
                            >
                                {modalState.confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GlobalModal;
