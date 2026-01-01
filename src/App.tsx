import { useEffect, useState } from 'react';
import {
    Download,
    FileText,
    Zap,
    Upload,
    Settings,
    Cpu,
    CheckCircle,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroOverlay from './components/IntroOverlay';
import InquiryBoard from './components/InquiryBoard';
import { useModal } from './hooks/useModal';

const App = () => {
    const { showAlert } = useModal();
    const [showIntro, setShowIntro] = useState(true);
    const [showSupport, setShowSupport] = useState(false);
    const adminEntry =
        typeof window !== 'undefined' &&
        (window.location.hash === '#admin' || new URLSearchParams(window.location.search).get('admin') === '1');

    useEffect(() => {
        if (adminEntry) {
            setShowIntro(false);
            setShowSupport(true);
        }
    }, [adminEntry]);

    const handleDownloadClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            event.preventDefault();
            showAlert('모바일에서는 다운로드가 불가합니다. \nPC에서 다운로드해주세요.', { title: '다운로드 안내' });
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0C10] text-slate-200 relative overflow-hidden font-sans selection:bg-[#66FCF1] selection:text-[#0B0C10]">
            <AnimatePresence>
                {showIntro && (
                    <IntroOverlay onComplete={() => setShowIntro(false)} />
                )}
                {showSupport && (
                    <InquiryBoard onClose={() => setShowSupport(false)} adminEntry={adminEntry} />
                )}
            </AnimatePresence>

            {!showSupport && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={!showIntro ? { opacity: 1 } : {}}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    {/* Background Ambient Glow */}
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#45A29E]/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#66FCF1]/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>

                    {/* Navbar */}
                    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0C10]/80 backdrop-blur-lg border-b border-[#1F2833]">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="flex justify-between items-center h-20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#1F2833] rounded-lg border border-[#45A29E]/30 glow-box">
                                        <FileText className="w-6 h-6 text-[#66FCF1]" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-wider">
                                        PDF Converter <span className="text-[#66FCF1]">Pro</span>
                                    </span>
                                </div>
                                <div className="hidden md:flex items-center space-x-10">
                                    <a href="#features" className="text-slate-400 hover:text-[#66FCF1] text-sm font-semibold transition-all hover:glow-text">기능 소개</a>
                                    <a href="#guide" className="text-slate-400 hover:text-[#66FCF1] text-sm font-semibold transition-all hover:glow-text">이용 방법</a>
                                    <button onClick={() => setShowSupport(true)} className="text-slate-400 hover:text-[#66FCF1] text-sm font-semibold transition-all hover:glow-text">고객 문의</button>
                                    <a href="/PDF_Converter_Pro_Installer.exe" download onClick={handleDownloadClick}
                                        className="bg-[#1F2833] hover:bg-[#45A29E] text-[#66FCF1] hover:text-white border border-[#45A29E]/50 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-[#66FCF1]/40 hover:-translate-y-0.5"
                                    >
                                        다운로드
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <header className="relative pt-40 pb-32 text-center z-10">
                        <div className="max-w-5xl mx-auto px-4 relative">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F2833] border border-[#45A29E]/30 text-[#66FCF1] text-xs font-bold mb-8 animate-float">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="tracking-wide">v1.0.0 정식 출시</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                                압도적 성능, <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#66FCF1] to-[#45A29E] glow-text">
                                    완벽한 PDF 변환
                                </span>
                            </h1>

                            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed break-keep font-medium">
                                엑셀, 워드, PPT 문서를 원본 그대로.<br className="hidden sm:block" />
                                보안 걱정 없는 100% 로컬 솔루션.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <a
                                    href="/PDF_Converter_Pro_Installer.exe" download
                                    onClick={handleDownloadClick}
                                    className="w-full sm:w-auto px-10 py-4 bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(102,252,241,0.4)] hover:shadow-[0_0_30px_rgba(102,252,241,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <Download className="w-5 h-5" />
                                    무료 다운로드
                                </a>
                            </div>
                        </div>
                    </header>

                    {/* Features Summary */}
                    <section id="features" className="py-24 bg-[#0B0C10] relative">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold text-white mb-8">왜 <span className="text-[#66FCF1]">PDF Converter Pro</span>인가?</h2>
                            <p className="max-w-2xl mx-auto text-slate-400 mb-16 leading-relaxed">
                                더 이상 시간을 낭비하지 마세요. <br />
                                강력한 로컬 엔진이 당신의 업무를 순식간에 끝냅니다.
                            </p>
                            <div className="grid md:grid-cols-3 gap-8 text-left">
                                <div className="p-6 rounded-2xl bg-[#1F2833]/50 border border-[#45A29E]/20 hover:border-[#66FCF1]/50 transition-all hover:bg-[#1F2833] group">
                                    <div className="w-12 h-12 bg-[#0B0C10] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FileText className="text-[#66FCF1]" />
                                    </div>
                                    <h3 className="text-white text-lg font-bold mb-2">모든 포맷 지원</h3>
                                    <p className="text-slate-400 text-sm">Excel, Word, PPT를 원본 레이아웃 그대로 변환합니다.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#1F2833]/50 border border-[#45A29E]/20 hover:border-[#66FCF1]/50 transition-all hover:bg-[#1F2833] group">
                                    <div className="w-12 h-12 bg-[#0B0C10] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Cpu className="text-[#66FCF1]" />
                                    </div>
                                    <h3 className="text-white text-lg font-bold mb-2">완벽한 보안</h3>
                                    <p className="text-slate-400 text-sm">서버 전송 없이 내 PC에서 안전하게 처리됩니다.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#1F2833]/50 border border-[#45A29E]/20 hover:border-[#66FCF1]/50 transition-all hover:bg-[#1F2833] group">
                                    <div className="w-12 h-12 bg-[#0B0C10] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Zap className="text-[#66FCF1]" />
                                    </div>
                                    <h3 className="text-white text-lg font-bold mb-2">초고속 엔진</h3>
                                    <p className="text-slate-400 text-sm">대량의 문서도 멈춤 없이 빠르게 처리합니다.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Process Section (New Icon Design) */}
                    <section id="guide" className="py-32 bg-[#0B0C10] relative">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#45A29E]/30 to-transparent"></div>

                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="text-center mb-24">
                                <h2 className="text-4xl font-extrabold text-white mb-6">Workflow Process</h2>
                                <p className="text-slate-400 text-lg">복잡한 과정 없이, 단 4단계로 끝납니다.</p>
                            </div>

                            <div className="relative">
                                {/* Connection Line (Desktop) */}
                                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-[#1F2833] -translate-y-1/2 z-0"></div>
                                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#66FCF1]/10 via-[#66FCF1] to-[#66FCF1]/10 -translate-y-1/2 z-0 opacity-20"></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">

                                    {/* Step 1 */}
                                    <div className="group relative flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-2xl bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#66FCF1] group-hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] transition-all duration-500 bg-gradient-to-br from-[#1F2833] to-[#0B0C10]">
                                            <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#66FCF1] transition-colors duration-300 transform group-hover:scale-110" />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#45A29E] text-[#0B0C10] flex items-center justify-center font-bold text-sm shadow-lg">1</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">파일 추가</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                                            문서를 드래그하여<br />목록에 놓으세요
                                        </p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="group relative flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-2xl bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#66FCF1] group-hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] transition-all duration-500 bg-gradient-to-br from-[#1F2833] to-[#0B0C10]">
                                            <Settings className="w-10 h-10 text-slate-400 group-hover:text-[#66FCF1] transition-colors duration-300 transform group-hover:rotate-90" />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#2C3E50] border border-[#45A29E] text-[#66FCF1] flex items-center justify-center font-bold text-sm shadow-lg">2</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">설정 체크</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                                            병합, 저장 경로 등<br />옵션을 선택하세요
                                        </p>

                                        {/* Arrow for mobile/tablet */}
                                        <div className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 text-[#1F2833] my-4">
                                            <ArrowRight className="w-6 h-6 rotate-90" />
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="group relative flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-2xl bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#66FCF1] group-hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] transition-all duration-500 bg-gradient-to-br from-[#1F2833] to-[#0B0C10]">
                                            <Cpu className="w-10 h-10 text-slate-400 group-hover:text-[#66FCF1] transition-colors duration-300 transform group-hover:scale-110" />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#2C3E50] border border-[#45A29E] text-[#66FCF1] flex items-center justify-center font-bold text-sm shadow-lg">3</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">즉시 변환</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                                            시작 버튼을 누르면<br />바로 처리됩니다
                                        </p>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="group relative flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-2xl bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#66FCF1] group-hover:shadow-[0_0_30px_rgba(102,252,241,0.2)] transition-all duration-500 bg-gradient-to-br from-[#1F2833] to-[#0B0C10]">
                                            <CheckCircle className="w-10 h-10 text-slate-400 group-hover:text-[#66FCF1] transition-colors duration-300 transform group-hover:scale-110" />
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#66FCF1] text-[#0B0C10] flex items-center justify-center font-bold text-sm shadow-lg">4</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">결과 확인</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                                            자동으로 열린 폴더에서<br />파일을 확인하세요
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="bg-[#050608] py-16 text-slate-500 border-t border-[#1F2833]">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-8">
                                <span className="text-xl font-bold text-white tracking-tight">PDF Converter <span className="text-[#66FCF1]">Pro</span></span>
                            </div>
                            <p className="text-sm max-w-md mx-auto leading-7">
                                © 2025 PDF Converter Pro. All rights reserved. <br />
                                Designed for privacy and performance. No data leaves your computer.
                            </p>
                        </div>
                    </footer>

                    {/* Mobile Support FAB */}
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowSupport(true)}
                        className="md:hidden fixed bottom-6 right-6 z-50 h-14 px-4 bg-[#66FCF1] rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(102,252,241,0.4)] text-[#0B0C10] font-bold"
                    >
                        <MessageSquare className="w-6 h-6 fill-current" />
                        <span className="text-sm">문의</span>
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default App;
