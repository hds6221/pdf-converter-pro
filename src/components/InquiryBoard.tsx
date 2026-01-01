import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Plus, CheckCircle, Shield, ShieldCheck, BookOpen, AlertTriangle, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Interfaces for Type Safety (Supabase Schema Match)
interface Inquiry {
    id: string;
    title: string;
    content: string;
    author: string;
    password?: string;
    is_secret: boolean;
    created_at: string; // ISO String from Supabase
    status: 'pending' | 'answered';
    reply: string | null;
}

const InquiryBoard = ({ onClose }: { onClose: () => void }) => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isWriteMode, setIsWriteMode] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSecret, setIsSecret] = useState(false);

    // Reply State
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error('Failed to fetch inquiries', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newInquiry = {
            title: newTitle,
            content: newContent,
            author: newAuthor,
            password: newPassword,
            is_secret: isSecret,
            status: 'pending',
            reply: null
        };

        try {
            const { error } = await supabase.from('inquiries').insert([newInquiry]);
            if (error) throw error;

            setIsWriteMode(false);
            resetForm();
            fetchInquiries();
        } catch (error: any) {
            alert('문의 등록 실패: ' + (error.message || '알 수 없는 오류'));
            console.error(error);
        }
    };

    const handleReply = async () => {
        if (!selectedInquiry) return;
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ reply: replyContent, status: 'answered' })
                .eq('id', selectedInquiry.id);

            if (error) throw error;

            const updated = { ...selectedInquiry, reply: replyContent, status: 'answered' as const };
            setSelectedInquiry(updated);
            setReplyContent('');
            fetchInquiries();
        } catch (error) {
            alert('답변 등록 실패');
            console.error(error);
        }
    };

    const handleDeleteReply = async () => {
        if (!selectedInquiry) return;
        if (!confirm('정말 답변을 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ reply: null, status: 'pending' })
                .eq('id', selectedInquiry.id);

            if (error) throw error;

            const updated = { ...selectedInquiry, reply: null, status: 'pending' as const };
            setSelectedInquiry(updated);
            fetchInquiries();
        } catch (error) {
            alert('답변 삭제 실패');
            console.error(error);
        }
    };

    const handleDeleteInquiry = async () => {
        if (!selectedInquiry) return;

        if (isAdmin) {
            if (!confirm('관리자 권한으로 삭제하시겠습니까?')) return;
        } else {
            const inputPwd = prompt('삭제하려면 비밀번호를 입력해주세요.');
            if (inputPwd !== selectedInquiry.password) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        try {
            const { error } = await supabase.from('inquiries').delete().eq('id', selectedInquiry.id);
            if (error) throw error;

            setSelectedInquiry(null);
            fetchInquiries();
        } catch (error) {
            alert('삭제 실패');
            console.error(error);
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewContent('');
        setNewAuthor('');
        setNewPassword('');
        setIsSecret(false);
    };

    const handleInquiryClick = (inquiry: Inquiry) => {
        if (inquiry.is_secret && !isAdmin) {
            const inputPwd = prompt('비밀글입니다. 비밀번호를 입력해주세요.');
            if (inputPwd !== inquiry.password) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
        }
        setSelectedInquiry(inquiry);
        setIsWriteMode(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative z-[60] min-h-screen w-full bg-[#0B0C10] text-slate-200 pt-24"
        >
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-white">고객 문의 센터</h2>
                        <button
                            onClick={() => setIsAdmin(!isAdmin)}
                            className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${isAdmin ? 'bg-[#66FCF1] text-[#0B0C10] border-[#66FCF1]' : 'border-slate-700 text-slate-500 hover:text-white'}`}
                        >
                            {isAdmin ? <div className="flex items-center gap-1"><ShieldCheck size={14} /> ADMIN ON</div> : <div className="flex items-center gap-1"><Shield size={14} /> ADMIN OFF</div>}
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#1F2833] rounded-full transition-colors">
                        <X className="w-8 h-8 text-slate-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">

                    {/* LEFT COLUMN: List OR Welcome Guide */}
                    <div className={`flex-1 transition-all flex flex-col ${selectedInquiry && !isWriteMode ? 'hidden lg:flex lg:w-1/3' : 'w-full'}`}>
                        {isWriteMode ? (
                            // Welcome Guide (Shown when Writing)
                            <div className="h-full flex flex-col justify-center p-8 bg-[#1F2833]/30 rounded-2xl border border-[#45A29E]/20">
                                <h3 className="text-2xl font-bold text-white mb-6">여러분의 소중한 의견을 들려주세요.</h3>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0C10]/50 hover:bg-[#0B0C10] transition-colors border border-transparent hover:border-[#45A29E]/30">
                                        <div className="mt-1"><ShieldCheck className="text-[#66FCF1] w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">오류 제보</h4>
                                            <p className="text-xs text-slate-500">프로그램 실행 오류나 버그가 발생했나요?</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0C10]/50 hover:bg-[#0B0C10] transition-colors border border-transparent hover:border-[#45A29E]/30">
                                        <div className="mt-1"><CheckCircle className="text-[#66FCF1] w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">기능 제안</h4>
                                            <p className="text-xs text-slate-500">더 편리한 기능을 제안해주세요.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0C10]/50 hover:bg-[#0B0C10] transition-colors border border-transparent hover:border-[#45A29E]/30">
                                        <div className="mt-1"><AlertTriangle className="text-[#66FCF1] w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">불편 사항 접수</h4>
                                            <p className="text-xs text-slate-500">사용 중 불편한 점을 알려주세요.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0C10]/50 hover:bg-[#0B0C10] transition-colors border border-transparent hover:border-[#45A29E]/30">
                                        <div className="mt-1"><BookOpen className="text-[#66FCF1] w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">사용법 문의</h4>
                                            <p className="text-xs text-slate-500">기능 사용법이 궁금하시면 언제든 물어보세요.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0C10]/50 hover:bg-[#0B0C10] transition-colors border border-transparent hover:border-[#45A29E]/30">
                                        <div className="mt-1"><Lock className="text-[#66FCF1] w-5 h-5" /></div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">비밀글 지원</h4>
                                            <p className="text-xs text-slate-500">개인적인 내용은 안심하고 비밀글로 작성하세요.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Inquiry List (Default View)
                            <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-300">문의 목록 ({inquiries.length})</h3>
                                    <button
                                        onClick={() => { setIsWriteMode(true); setSelectedInquiry(null); }}
                                        className="flex items-center gap-2 bg-[#1F2833] hover:bg-[#45A29E] text-[#66FCF1] hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                                    >
                                        <Plus size={16} /> 문의하기
                                    </button>
                                </div>

                                {/* List Container - Removing inner scroll and fixed height for natural scrolling */}
                                <div className="space-y-3">
                                    {loading ? (
                                        <div className="flex justify-center items-center py-20">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#66FCF1]"></div>
                                        </div>
                                    ) : inquiries.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-16 text-center bg-[#1F2833]/30 rounded-xl border border-dashed border-slate-700"
                                        >
                                            <div className="w-16 h-16 bg-[#1F2833] rounded-full flex items-center justify-center mb-4 text-slate-500">
                                                <MessageSquare size={32} />
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2">등록된 문의가 없습니다</h4>
                                            <p className="text-slate-500 text-sm mb-6 max-w-[250px]">
                                                궁금한 점이나 건의사항이 있으신가요?<br />
                                                첫 번째 문의를 남겨보세요!
                                            </p>
                                            <button
                                                onClick={() => { setIsWriteMode(true); setSelectedInquiry(null); }}
                                                className="px-5 py-2 bg-[#66FCF1]/10 hover:bg-[#66FCF1]/20 text-[#66FCF1] border border-[#66FCF1]/50 rounded-lg text-sm font-bold transition-all"
                                            >
                                                문의 작성하기
                                            </button>
                                        </motion.div>
                                    ) : (
                                        inquiries.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                onClick={() => handleInquiryClick(item)}
                                                className={`p-5 rounded-xl bg-[#1F2833]/30 border border-[#45A29E]/10 cursor-pointer hover:bg-[#1F2833] hover:border-[#66FCF1]/30 transition-all group ${selectedInquiry?.id === item.id ? 'border-[#66FCF1] bg-[#1F2833]' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {item.is_secret && <Lock size={14} className="text-[#FF6B6B]" />}
                                                        <span className={`font-bold text-lg ${item.is_secret && !isAdmin ? 'text-slate-500' : 'text-white'}`}>
                                                            {item.is_secret && !isAdmin ? '비밀글입니다.' : item.title}
                                                        </span>
                                                    </div>
                                                    {item.status === 'answered' ? (
                                                        <span className="text-[#66FCF1] text-xs font-bold px-2 py-1 bg-[#66FCF1]/10 rounded border border-[#66FCF1]/30">답변완료</span>
                                                    ) : (
                                                        <span className="text-slate-500 text-xs font-bold px-2 py-1 bg-slate-800 rounded border border-slate-700">대기중</span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-500">
                                                    <span>{item.author}</span>
                                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </motion.div>
                                        )))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Detail OR Write Form */}
                    {(selectedInquiry || isWriteMode) && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 lg:max-w-2xl bg-[#1F2833]/50 border border-[#45A29E]/20 rounded-2xl p-8 h-fit min-h-[600px]"
                        >
                            {isWriteMode ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-6">새로운 문의 작성</h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">제목</label>
                                        <input
                                            type="text" required
                                            value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                            placeholder="문의 제목을 입력해주세요"
                                            className="w-full bg-[#0B0C10] border border-slate-700 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none placeholder:text-slate-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">작성자</label>
                                            <input
                                                type="text" required
                                                value={newAuthor} onChange={e => setNewAuthor(e.target.value)}
                                                placeholder="닉네임"
                                                className="w-full bg-[#0B0C10] border border-slate-700 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400">비밀번호</label>
                                            <input
                                                type="password" required
                                                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                                placeholder="수정/삭제 시 필요"
                                                className="w-full bg-[#0B0C10] border border-slate-700 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400">내용</label>
                                        <textarea
                                            required rows={8}
                                            value={newContent} onChange={e => setNewContent(e.target.value)}
                                            placeholder="오류 제보 시 발생 상황을 구체적으로 적어주시면 큰 도움이 됩니다."
                                            className="w-full bg-[#0B0C10] border border-slate-700 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none resize-none placeholder:text-slate-600"
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center gap-2 bg-[#0B0C10] p-3 rounded-lg border border-slate-800">
                                        <input
                                            type="checkbox" id="secret"
                                            checked={isSecret} onChange={e => setIsSecret(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-700 bg-[#0B0C10] text-[#66FCF1] accent-[#66FCF1]"
                                        />
                                        <label htmlFor="secret" className="text-sm text-slate-300 cursor-pointer select-none font-medium">비밀글로 작성 (관리자와 본인만 확인 가능)</label>
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <button type="submit" className="flex-1 bg-[#66FCF1] hover:bg-[#45A29E] text-[#0B0C10] font-bold py-3 rounded-lg transition-colors shadow-lg shadow-[#66FCF1]/20">
                                            등록하기
                                        </button>
                                        <button type="button" onClick={() => setIsWriteMode(false)} className="px-6 py-3 border border-slate-700 text-slate-400 font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                            취소
                                        </button>
                                    </div>
                                </form>
                            ) : selectedInquiry && (
                                <div className="space-y-6 relative h-full flex flex-col">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                {selectedInquiry.is_secret && <Lock size={16} className="text-[#FF6B6B]" />}
                                                <span className="text-xs font-bold text-[#66FCF1] px-2 py-1 bg-[#66FCF1]/10 rounded border border-[#66FCF1]/20">
                                                    {selectedInquiry.status === 'answered' ? '답변완료' : '대기중'}
                                                </span>
                                                <span className="text-xs text-slate-500">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white leading-relaxed">{selectedInquiry.title}</h3>
                                        </div>

                                        {/* Delete Button Moved Here for better visibility */}
                                        <button
                                            onClick={handleDeleteInquiry}
                                            className="shrink-0 px-3 py-1.5 bg-red-500/10 border border-red-500/30 hover:border-red-500 hover:bg-red-500/20 text-red-500 rounded text-xs font-bold transition-all"
                                        >
                                            삭제
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 pb-6 border-b border-slate-700">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                            {selectedInquiry.author[0]}
                                        </div>
                                        <span className="font-bold text-slate-400">{selectedInquiry.author}</span>
                                    </div>

                                    <div className="py-4 text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[100px] flex-1">
                                        {selectedInquiry.content}
                                    </div>

                                    {/* Admin Filter for Password */}
                                    {isAdmin && (
                                        <div className="text-xs text-slate-600 font-mono mt-2 bg-[#000] p-2 rounded">
                                            Admin Info - Password: {selectedInquiry.password}
                                        </div>
                                    )}

                                    {/* Answer Section */}
                                    {selectedInquiry.reply ? (
                                        <div className="mt-8 bg-[#66FCF1]/5 border border-[#66FCF1]/20 rounded-xl p-6 relative group">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded bg-[#66FCF1] flex items-center justify-center">
                                                    <CheckCircle size={14} className="text-[#0B0C10]" />
                                                </div>
                                                <span className="font-bold text-[#66FCF1]">관리자 답변</span>
                                                <span className="text-xs text-[#66FCF1]/50 ml-auto">Verified Staff</span>
                                            </div>
                                            <p className="text-slate-300 leading-relaxed">{selectedInquiry.reply}</p>

                                            {/* Delete Reply Button */}
                                            {isAdmin && (
                                                <button
                                                    onClick={handleDeleteReply}
                                                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="답변 삭제"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-8">
                                            {isAdmin ? (
                                                <div className="space-y-3">
                                                    <label className="text-sm font-bold text-[#66FCF1]">답변 작성 (관리자)</label>
                                                    <textarea
                                                        value={replyContent} onChange={e => setReplyContent(e.target.value)}
                                                        className="w-full bg-[#0B0C10] border border-[#66FCF1]/30 rounded-lg p-3 text-white focus:border-[#66FCF1] focus:outline-none resize-none form-textarea"
                                                        rows={4}
                                                        placeholder="답변을 입력하세요..."
                                                    ></textarea>
                                                    <button onClick={handleReply} className="w-full bg-[#1F2833] hover:bg-[#66FCF1] border border-[#66FCF1] text-[#66FCF1] hover:text-[#0B0C10] font-bold py-3 rounded-lg transition-colors">
                                                        답변 등록
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-slate-800/30 rounded-xl text-center text-slate-500 text-sm border border-slate-700/50">
                                                    아직 답변이 등록되지 않았습니다.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button onClick={() => setSelectedInquiry(null)} className="lg:hidden w-full mt-6 py-3 border border-slate-700 rounded-lg text-slate-400">
                                        목록으로 돌아가기
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
export default InquiryBoard;
