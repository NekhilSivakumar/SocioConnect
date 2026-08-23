'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  Video,
  Smile,
  Mic,
  CheckCheck,
  Check,
  Plus,
  MapPin,
  Info,
  X,
  Trash2,
  ArrowRight,
  ArrowLeft,
  User,
  LogOut,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';
import { db, isFirebaseConfigured, FirestoreGroup, FirestoreMessage } from '@/lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────
// TYPES & HELPERS
// ─────────────────────────────────────────────────────────────────────
type PrivacyFields = {
  isPrivate?: boolean;
  password?: string;
};
type PrivateGroup = FirestoreGroup & PrivacyFields;

function normalizeName(name: string | undefined | null): string {
  return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

// ─────────────────────────────────────────────────────────────────────
// NAME ENTRY SPLASH PAGE
// ─────────────────────────────────────────────────────────────────────
function NameEntryPage({ onEnter }: { onEnter: (name: string) => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length >= 2) {
      onEnter(cleanName);
    }
  };

  return (
    <div className="app-font h-[100dvh] w-full flex items-center justify-center bg-black relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-white/5 blur-[80px]" />
        <div className="absolute -bottom-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-white/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-neutral-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center shadow-xl">
            <MessageSquare className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-2xl font-black text-white text-center tracking-tight mb-1">SocioConnect</h1>
          <p className="text-xs text-white/50 text-center mb-8 font-medium">Connect with VITians instantly</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                maxLength={20}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>

            <button
              disabled={name.trim().length < 2}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN CHAT APPLICATION
// ─────────────────────────────────────────────────────────────────────
function ChatApp({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [groups, setGroups] = useState<PrivateGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Forms & Password states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState<boolean>(false);
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [unlockedGroups, setUnlockedGroups] = useState<Set<string>>(new Set());
  const [passwordPromptGroup, setPasswordPromptGroup] = useState<PrivateGroup | null>(null);
  const [passwordAttempt, setPasswordAttempt] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Group Listener
  useEffect(() => {
    if (isFirebaseConfigured) {
      const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PrivateGroup));
        setGroups(fetched);
      });
    }
  }, []);

  // Message Listener
  useEffect(() => {
    if (!activeGroupId || !isFirebaseConfigured) return;
    const q = query(collection(db, 'groups', activeGroupId, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreMessage)));
    });
  }, [activeGroupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim() || !activeGroupId) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      sender: 'them',
      senderName: userName,
      text: text.trim(),
      timestamp: time,
      status: 'sent',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'groups', activeGroupId, 'messages'), newMsg);
      await setDoc(doc(db, 'groups', activeGroupId), {
        lastMessage: `${userName}: ${text.trim()}`,
        lastMessageTime: time
      }, { merge: true });
      if (!textOverride) setInputText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-font h-[100dvh] w-full bg-black text-white flex flex-col overflow-hidden">
      
      {/* Container - No margins on mobile for full-screen feel */}
      <div className="flex-1 flex overflow-hidden sm:m-2 md:m-3 sm:rounded-3xl bg-neutral-950 border-neutral-800 sm:border relative">
        
        {/* LEFT SIDEBAR - Responsive Toggle */}
        <aside className={`${activeGroupId ? 'hidden' : 'flex'} md:flex w-full md:w-[350px] lg:w-[400px] flex-col border-r border-neutral-900 bg-black`}>
          
          <div className="p-4 flex items-center justify-between border-b border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold">
                {userName.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="font-bold text-sm">{userName}</h2>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowNewGroupModal(true)} className="p-2.5 rounded-full bg-white text-black active:scale-90 transition-transform">
                <Plus size={20} />
              </button>
              <button onClick={onLogout} className="p-2.5 rounded-full bg-neutral-900 text-neutral-400">
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Filters - Scrollable on mobile */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-neutral-900">
            {['all', 'sports', 'mentor', 'hostel', 'hackathon'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold capitalize whitespace-nowrap transition-colors ${
                  filterCategory === cat ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lobby List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {groups.filter(g => filterCategory === 'all' || g.category === filterCategory).map(group => (
              <div
                key={group.id}
                onClick={() => {
                  if (group.isPrivate && !unlockedGroups.has(group.id!)) {
                    setPasswordPromptGroup(group);
                  } else {
                    setActiveGroupId(group.id!);
                  }
                }}
                className="p-4 flex items-center gap-4 active:bg-neutral-900 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-2xl shrink-0">
                  {group.isPrivate ? '🔒' : group.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-sm font-bold truncate pr-2">{group.name}</h3>
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">{group.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{group.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <section className={`${activeGroupId ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-black relative`}>
          {activeGroup ? (
            <>
              {/* Chat Header */}
              <header className="h-16 px-4 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => setActiveGroupId(null)} className="md:hidden p-1 -ml-1">
                    <ArrowLeft size={24} />
                  </button>
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
                    {activeGroup.avatar}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold truncate leading-tight">{activeGroup.name}</h3>
                    <p className="text-[10px] text-neutral-500">{activeGroup.membersCount} active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowInfoSidebar(true)} className="p-2 text-neutral-400">
                    <Info size={20} />
                  </button>
                </div>
              </header>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => {
                  const isMe = normalizeName(msg.senderName) === normalizeName(userName);
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe ? 'bg-white text-black rounded-tr-none' : 'bg-neutral-900 text-white rounded-tl-none'
                      }`}>
                        {!isMe && <p className="text-[10px] font-bold text-neutral-500 mb-1">{msg.senderName}</p>}
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-black/40' : 'text-neutral-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input - Optimized for Mobile Typing */}
              <footer className="p-3 pb-safe border-t border-neutral-900 bg-black">
                <div className="flex items-center gap-2 max-w-full">
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full bg-neutral-900 border-none rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center text-4xl mb-4">🏠</div>
              <h3 className="font-bold">Welcome, {userName}</h3>
              <p className="text-xs text-neutral-500 mt-2">Select a lobby to start chatting with other VITians.</p>
            </div>
          )}
        </section>
      </div>

      {/* MODALS (Simplified for responsiveness) */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-neutral-950 rounded-t-[2rem] sm:rounded-[2rem] p-6 border-t sm:border border-neutral-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">New Lobby</h3>
                <button onClick={() => setShowNewGroupModal(false)} className="p-2"><X /></button>
              </div>
              <div className="space-y-4">
                <input
                  placeholder="Lobby Title"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none border border-transparent focus:border-white/10"
                />
                <select 
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value as any)}
                  className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none"
                >
                  <option value="sports">Sports Match ⚽</option>
                  <option value="mentor">Seniors 🎓</option>
                  <option value="hostel">Hostels 🏢</option>
                  <option value="hackathon">Hackathons 🚀</option>
                </select>
                
                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl">
                   <span className="text-sm font-medium">Private Lobby</span>
                   <input 
                    type="checkbox" 
                    checked={newGroupIsPrivate} 
                    onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                    className="w-5 h-5 accent-white"
                   />
                </div>

                {newGroupIsPrivate && (
                  <input
                    type="password"
                    placeholder="Lobby Password"
                    value={newGroupPassword}
                    onChange={(e) => setNewGroupPassword(e.target.value)}
                    className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none border border-transparent focus:border-white/10"
                  />
                )}

                <button 
                  onClick={async () => {
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const emojiMap = { sports: '⚽', mentor: '🎓', hostel: '🏢', hackathon: '🚀' };
                    const docRef = await addDoc(collection(db, 'groups'), {
                      name: newGroupName,
                      avatar: newGroupIsPrivate ? '🔒' : emojiMap[newGroupCategory],
                      category: newGroupCategory,
                      lastMessage: `${userName} created the group`,
                      lastMessageTime: time,
                      membersCount: 1,
                      isPrivate: newGroupIsPrivate,
                      password: newGroupPassword,
                      createdAt: serverTimestamp()
                    });
                    setActiveGroupId(docRef.id);
                    setShowNewGroupModal(false);
                  }}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl mt-4 active:scale-95 transition-transform"
                >
                  Create Lobby
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Private Lobby Password Prompt */}
        {passwordPromptGroup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-xs text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-2">Private Lobby</h3>
              <p className="text-xs text-neutral-500 mb-6">Enter password for "{passwordPromptGroup.name}"</p>
              <input
                type="password"
                autoFocus
                className="w-full bg-neutral-900 rounded-xl p-4 text-center text-sm mb-4 outline-none border border-neutral-800 focus:border-white/20"
                placeholder="••••"
                value={passwordAttempt}
                onChange={(e) => setPasswordAttempt(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setPasswordPromptGroup(null)} className="flex-1 py-3 text-xs font-bold text-neutral-500">Cancel</button>
                <button 
                  onClick={() => {
                    if (passwordAttempt === passwordPromptGroup.password) {
                      setUnlockedGroups(prev => new Set(prev).add(passwordPromptGroup.id!));
                      setActiveGroupId(passwordPromptGroup.id!);
                      setPasswordPromptGroup(null);
                      setPasswordAttempt('');
                    } else {
                      alert('Wrong password');
                    }
                  }}
                  className="flex-1 py-3 bg-white text-black rounded-xl text-xs font-bold"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function SocioConnectApp() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('socioconnect_username');
    if (saved) setUserName(saved);
    setIsLoading(false);
  }, []);

  const handleEnterName = (name: string) => {
    localStorage.setItem('socioconnect_username', name);
    setUserName(name);
  };

  if (isLoading) return <div className="h-[100dvh] w-full bg-black" />;
  
  return !userName ? (
    <NameEntryPage onEnter={handleEnterName} />
  ) : (
    <ChatApp userName={userName} onLogout={() => {
      localStorage.removeItem('socioconnect_username');
      setUserName(null);
    }} />
  );
}