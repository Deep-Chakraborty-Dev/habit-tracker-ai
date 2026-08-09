import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, RefreshCw, Dumbbell, Briefcase } from 'lucide-react';
import { useHabitChat } from '../../hooks/useAI';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { messages, askQuestion, isLoading, clearChat } = useHabitChat();
  const feedEndRef = useRef(null);

  // Auto scroll to bottom of chat when messages update or loading changes
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText('');
    await askQuestion(textToSend);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl z-[140] hover:scale-105 active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, var(--color-amber-glow, #f59e0b), var(--color-purple-accent, #a855f7))',
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.35)',
        }}
        whileHover={{ rotate: 10 }}
        aria-label="Toggle AI assistant chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Sidebar/Overlay Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-40 md:bottom-26 right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] rounded-2xl border shadow-2xl flex flex-col justify-between overflow-hidden z-[140] bg-neutral-950/95 backdrop-blur-md"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-black/40" style={{ borderColor: 'var(--glass-border)' }}>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-400 absolute top-0 left-0 opacity-80" />
                  <Dumbbell className="w-5.5 h-5.5 text-amber-500 absolute bottom-0 right-0 rotate-45" style={{ filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.4))' }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI-Tracker Coach</h4>
                  <p className="text-[9px] text-neutral-400 font-semibold tracking-wider uppercase">Active Session</p>
                </div>
              </div>

              {/* Reset/Clear Chat Button */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Clear chat history"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Message Feed List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none bg-neutral-900/10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border" style={{ borderColor: 'var(--glass-border)' }}>
                    <Sparkles className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Ask your AI Coach</p>
                    <p className="text-[10px] leading-relaxed text-neutral-400 max-w-[200px]">
                      &ldquo;Why am I losing consistency on gym?&rdquo; or &ldquo;Give me my average streaks.&rdquo;
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={index}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-amber-500 text-white rounded-br-none'
                            : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-white/5'
                        }`}
                        style={{
                          background: isUser
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : undefined,
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 rounded-2xl rounded-bl-none border border-white/5 px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span className="text-[10px] text-neutral-400 font-medium">Analyzing logs...</span>
                  </div>
                </div>
              )}
              <div ref={feedEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t bg-black/40 flex items-center gap-2"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about your performance..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs outline-none bg-black/20 border transition-all text-white"
                style={{ borderColor: 'var(--glass-border)' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center text-white cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
