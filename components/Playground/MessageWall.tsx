import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Message, MessageComment, getMessages, createMessage, getComments, createComment } from '../../lib/supabase';

export const MessageWall: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<string, MessageComment[]>>({});
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState<string | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        setIsLoading(true);
        const data = await getMessages();
        setMessages(data);
        setIsLoading(false);
    };

    const handleAddMessage = async () => {
        if (!newMessage.trim() || newMessage.length > 300) return;
        setIsSubmitting(true);
        const result = await createMessage(newMessage.trim());
        if (result.success && result.message) {
            setMessages(prev => [result.message!, ...prev]);
            setNewMessage('');
            setShowAddModal(false);
        }
        setIsSubmitting(false);
    };

    const handleToggleComments = async (messageId: string) => {
        if (expandedMessage === messageId) {
            setExpandedMessage(null);
            return;
        }
        setExpandedMessage(messageId);
        if (!comments[messageId]) {
            setLoadingComments(messageId);
            const data = await getComments(messageId);
            setComments(prev => ({ ...prev, [messageId]: data }));
            setLoadingComments(null);
        }
    };

    const handleAddComment = async (messageId: string) => {
        if (!newComment.trim()) return;
        const result = await createComment(messageId, newComment.trim());
        if (result.success && result.comment) {
            setComments(prev => ({
                ...prev,
                [messageId]: [...(prev[messageId] || []), result.comment!]
            }));
            setNewComment('');
        }
    };

    return (
        <div className="pt-20 pb-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-3">
                        Message Wall
                    </h1>
                    <p className="text-brand-line/60 text-sm">
                        자유롭게 메시지를 남겨주세요! 모든 글은 익명입니다.
                    </p>
                </div>

                {/* Messages Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {messages.map((message) => (
                            <PostItCard
                                key={message.id}
                                message={message}
                                isExpanded={expandedMessage === message.id}
                                comments={comments[message.id] || []}
                                loadingComments={loadingComments === message.id}
                                onToggle={() => handleToggleComments(message.id)}
                                newComment={expandedMessage === message.id ? newComment : ''}
                                onCommentChange={setNewComment}
                                onAddComment={() => handleAddComment(message.id)}
                            />
                        ))}
                    </div>
                )}

                {messages.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <p className="text-brand-line/50 text-lg mb-4">아직 메시지가 없어요</p>
                        <p className="text-brand-line/30 text-sm">첫 번째 메시지를 남겨보세요!</p>
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 z-40"
            >
                <Plus className="w-7 h-7 text-white" />
            </motion.button>

            {/* Add Message Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10 w-full max-w-md"
                        >
                            <div
                                className="p-6 rounded-lg shadow-2xl"
                                style={{
                                    backgroundColor: '#fef08a',
                                    transform: 'rotate(-1deg)'
                                }}
                            >
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-700" />
                                </button>

                                <h3 className="font-bold text-xl text-gray-800 mb-4">
                                    ✏️ 메시지 남기기
                                </h3>

                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value.slice(0, 300))}
                                    placeholder="익명으로 메시지를 남겨주세요..."
                                    className="w-full h-32 bg-transparent border-none resize-none text-gray-800 placeholder:text-gray-500/60 focus:outline-none text-lg leading-relaxed"
                                    autoFocus
                                />

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-sm text-gray-500">
                                        {newMessage.length}/300
                                    </span>
                                    <button
                                        onClick={handleAddMessage}
                                        disabled={!newMessage.trim() || isSubmitting}
                                        className="px-5 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                붙이기
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Post-it Card Component
interface PostItCardProps {
    message: Message;
    isExpanded: boolean;
    comments: MessageComment[];
    loadingComments: boolean;
    onToggle: () => void;
    newComment: string;
    onCommentChange: (value: string) => void;
    onAddComment: () => void;
}

const PostItCard: React.FC<PostItCardProps> = ({
    message,
    isExpanded,
    comments,
    loadingComments,
    onToggle,
    newComment,
    onCommentChange,
    onAddComment
}) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            style={{
                transform: `rotate(${message.rotation}deg)`
            }}
        >
            <div
                className="p-4 rounded-sm shadow-lg cursor-pointer transition-shadow hover:shadow-xl min-h-[140px] flex flex-col"
                style={{ backgroundColor: message.color }}
                onClick={onToggle}
            >
                {/* Tape effect */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 rounded-sm" />

                {/* Content */}
                <p className="text-gray-800 text-sm leading-relaxed flex-1 break-words whitespace-pre-wrap">
                    {message.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/10">
                    <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">{comments.length}</span>
                        {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 bg-brand-deep rounded-lg border border-white/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{ transform: `rotate(${-message.rotation}deg)` }}
                    >
                        <div className="p-3 max-h-48 overflow-y-auto">
                            {loadingComments ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-5 h-5 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-brand-line/40 text-xs py-2">
                                    아직 댓글이 없어요
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="bg-white/5 rounded-lg p-2">
                                            <p className="text-brand-text text-xs">{comment.content}</p>
                                            <span className="text-brand-line/40 text-[10px]">
                                                {formatDate(comment.created_at)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Comment */}
                            <div className="flex gap-2 mt-3 pt-2 border-t border-white/10">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => onCommentChange(e.target.value.slice(0, 200))}
                                    placeholder="댓글 남기기..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-brand-text placeholder:text-brand-line/30 focus:outline-none focus:border-accent-gold/50"
                                    onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
                                />
                                <button
                                    onClick={onAddComment}
                                    disabled={!newComment.trim()}
                                    className="px-3 py-2 bg-accent-gold text-brand-bg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
