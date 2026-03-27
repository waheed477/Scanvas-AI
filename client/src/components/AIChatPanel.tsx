import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialIssue?: any;
}

export function AIChatPanel({ isOpen, onClose, initialIssue }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialIssue && isOpen && messages.length === 0) {
      const issueMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `How do I fix this accessibility issue?\n\nIssue: ${initialIssue.help}\nDescription: ${initialIssue.description}`,
        timestamp: new Date()
      };
      setMessages([issueMessage]);
      getAIFix(initialIssue);
    }
  }, [initialIssue, isOpen]);

  const getAIFix = async (issue: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          issue: {
            description: issue.description,
            help: issue.help,
            impact: issue.impact
          }
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.suggestion,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      toast({
        title: "❌ AI Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.suggestion,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      toast({
        title: "❌ AI Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-[#1e293b] shadow-2xl border-l border-[#e2e8f0] dark:border-[#334155] z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563eb] dark:text-[#7c3aed]" />
            <h2 className="font-semibold text-[#0f172a] dark:text-white">AI Assistant</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white'
                  : 'bg-[#f1f5f9] dark:bg-[#0f172a] text-[#0f172a] dark:text-white'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#f1f5f9] dark:bg-[#0f172a] rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#2563eb]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#e2e8f0] dark:border-[#334155]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about accessibility..."
              className="flex-1 px-3 py-2 text-sm bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}