'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Plus,
  Info,
  X,
  Trash2,
  ArrowRight,
  ArrowLeft,
  User,
  LogOut,
  Lock,
  Send
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
    <div className="app-font h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-black via-blue-950 to-neutral-950 relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 25, -15, 0], y: [0, -30, 15, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-600/10 blur-[90px]"
        />
        <motion.div
          animate={{ x: [0, -20, 25, 0], y: [0, 25, -20, 0], scale: [1, 0.92, 1.06, 1] }}
          transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-blue-500/10 blur-[110px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.15 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-900/50"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h1 className="text-2xl font-black text-white text-center tracking-tight mb-1">SocioConnect</h1>
            <p className="text-xs text-blue-200/50 text-center mb-8 font-medium">Instant Community Messaging</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <User className="w-4 h-4 text-blue-200/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                maxLength={20}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <button
              disabled={name.trim().length < 2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {['⚽ Sports', '💼 Projects', '🏠 Housing', '🚀 Events'].map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-blue-100/60">{tag}</span>
            ))}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-blue-200/30 mt-5"
        >
          Community Network • Secure & Encrypted
        </motion.p>
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
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState<boolean>(false);
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [unlockedGroups, setUnlockedGroups] = useState<Set<string>>(new Set());
  const [passwordPromptGroup, setPasswordPromptGroup] = useState<PrivateGroup | null>(null);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isFirebaseConfigured) {
      const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        setGroups(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PrivateGroup)));
      });
    }
  }, []);

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

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    setIsDeletingGroup(true);
    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages');
      const messagesSnap = await getDocs(messagesRef);
      await Promise.all(messagesSnap.docs.map((msgDoc) => deleteDoc(msgDoc.ref)));
      await deleteDoc(doc(db, 'groups', groupId));
      
      triggerToast(`🗑️ Lobby "${groupName}" deleted`);
      setActiveGroupId(null);
      setMessages([]);
      setShowInfoSidebar(false);
      setShowDeleteConfirm(false);
    } catch (err) {
      triggerToast(`⚠️ Error deleting lobby`);
    } finally {
      setIsDeletingGroup(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeGroupId) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    try {
      await addDoc(collection(db, 'groups', activeGroupId, 'messages'), {
        sender: 'user',
        senderName: userName,
        text: inputText.trim(),
        timestamp: time,
        status: 'sent',
        createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'groups', activeGroupId), {
        lastMessage: `${userName}: ${inputText.trim()}`,
        lastMessageTime: time
      }, { merge: true });
      setInputText('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-font h-[100dvh] w-full bg-gradient-to-br from-black via-blue-950 to-neutral-950 text-white flex flex-col overflow-hidden">
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] bg-neutral-900 border border-neutral-800 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-xl">
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden sm:m-2 md:m-3 sm:rounded-3xl bg-neutral-950/70 border-neutral-800 sm:border relative">
        
        {/* SIDEBAR */}
        <aside className={`${activeGroupId ? 'hidden' : 'flex'} md:flex w-full md:w-[350px] lg:w-[400px] flex-col border-r border-neutral-900 bg-transparent`}>
          <div className="p-4 flex items-center justify-between border-b border-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                {userName.slice(0,1).toUpperCase()}
              </div>
              <h2 className="font-bold text-sm">{userName}</h2>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowNewGroupModal(true)} className="p-2.5 rounded-full bg-white text-black active:scale-90 transition-transform"><Plus size={20} /></button>
              <button onClick={onLogout} className="p-2.5 rounded-full bg-neutral-900 text-neutral-400"><LogOut size={18} /></button>
            </div>
          </div>

          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-neutral-900">
            {['all', 'sports', 'mentor', 'hostel', 'hackathon'].map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold capitalize transition-colors ${filterCategory === cat ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'}`}>
                {cat === 'mentor' ? 'Mentors' : cat === 'hostel' ? 'Housing' : cat === 'hackathon' ? 'Tech' : cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {groups.filter(g => filterCategory === 'all' || g.category === filterCategory).map(group => (
              <div key={group.id} onClick={() => group.isPrivate && !unlockedGroups.has(group.id!) ? setPasswordPromptGroup(group) : setActiveGroupId(group.id!)} className="p-4 flex items-center gap-4 active:bg-neutral-900 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-2xl shrink-0">{group.isPrivate ? '🔒' : group.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold truncate">{group.name}</h3>
                    <span className="text-[10px] text-neutral-500">{group.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{group.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className={`${activeGroupId ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-transparent relative`}>
          {activeGroup ? (
            <>
              <header className="h-16 px-4 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveGroupId(null)} className="md:hidden"><ArrowLeft size={24} /></button>
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-xl">{activeGroup.avatar}</div>
                  <h3 className="text-sm font-bold">{activeGroup.name}</h3>
                </div>
                <button onClick={() => setShowInfoSidebar(true)} className="p-2 text-neutral-400"><Info size={20} /></button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => {
                  const isMe = normalizeName(msg.senderName) === normalizeName(userName);
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-neutral-900 text-white rounded-tl-none'}`}>
                        {!isMe && <p className="text-[10px] font-bold text-blue-400 mb-1">{msg.senderName}</p>}
                        <p>{msg.text}</p>
                        <p className="text-[9px] mt-1 text-right opacity-50">{msg.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <footer className="p-3 border-t border-neutral-900">
                <div className="flex gap-2">
                  <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-neutral-900 rounded-2xl py-3 px-4 text-sm outline-none" />
                  <button onClick={handleSendMessage} className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 active:scale-90 transition-transform"><Send size={18} /></button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center text-4xl mb-4">💬</div>
              <h3 className="font-bold">Welcome to SocioConnect</h3>
              <p className="text-xs text-neutral-500 mt-2">Pick a lobby to start chatting.</p>
            </div>
          )}
        </section>

        {/* INFO & DELETE SIDEBAR */}
        <AnimatePresence>
          {showInfoSidebar && activeGroup && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setShowInfoSidebar(false); setShowDeleteConfirm(false);}} className="fixed inset-0 z-30 bg-black/70 md:hidden" />
              <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 z-40 w-full sm:w-[320px] md:static md:w-[320px] h-full border-l border-neutral-900 bg-neutral-950 flex flex-col">
                <div className="h-16 px-4 border-b border-neutral-900 flex items-center justify-between">
                  <h3 className="text-sm font-bold">Lobby Info</h3>
                  <button onClick={() => {setShowInfoSidebar(false); setShowDeleteConfirm(false);}}><X size={18} /></button>
                </div>
                <div className="p-8 text-center border-b border-neutral-900">
                  <div className="w-20 h-20 rounded-3xl bg-neutral-900 mx-auto flex items-center justify-center text-4xl mb-4">{activeGroup.avatar}</div>
                  <h4 className="font-bold">{activeGroup.name}</h4>
                  <p className="text-xs text-neutral-500 mt-1 capitalize">{activeGroup.category}</p>
                </div>
                <div className="p-6">
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-3 bg-red-950/20 border border-red-900/30 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                      <Trash2 size={14} /> Delete Lobby
                    </button>
                  ) : (
                    <div className="bg-red-950/10 p-4 rounded-xl border border-red-900/20">
                      <p className="text-[11px] text-red-400 mb-3 text-center">Delete this lobby and all messages forever?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-neutral-900 rounded-lg text-xs">No</button>
                        <button onClick={() => handleDeleteGroup(activeGroup.id!, activeGroup.name)} disabled={isDeletingGroup} className="flex-1 py-2 bg-red-600 rounded-lg text-xs font-bold">
                          {isDeletingGroup ? '...' : 'Yes, Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full max-w-md bg-neutral-950 rounded-t-[2rem] sm:rounded-[2rem] p-6 border-t sm:border border-neutral-800">
              <div className="flex justify-between items-center mb-6"><h3 className="font-bold">Create Lobby</h3><button onClick={() => setShowNewGroupModal(false)}><X /></button></div>
              <div className="space-y-4">
                <input placeholder="Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none" />
                <select value={newGroupCategory} onChange={(e) => setNewGroupCategory(e.target.value as any)} className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none">
                  <option value="sports">Sports ⚽</option>
                  <option value="mentor">Mentorship 🎓</option>
                  <option value="hostel">Housing 🏢</option>
                  <option value="hackathon">Projects/Tech 🚀</option>
                </select>
                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl text-sm">
                  <span>Private Lobby</span>
                  <input type="checkbox" checked={newGroupIsPrivate} onChange={(e) => setNewGroupIsPrivate(e.target.checked)} className="w-5 h-5 accent-blue-500" />
                </div>
                {newGroupIsPrivate && <input type="password" placeholder="Password" value={newGroupPassword} onChange={(e) => setNewGroupPassword(e.target.value)} className="w-full bg-neutral-900 rounded-xl p-4 text-sm outline-none" />}
                <button onClick={async () => {
                   const emojiMap = { sports: '⚽', mentor: '🎓', hostel: '🏢', hackathon: '🚀' };
                   const docRef = await addDoc(collection(db, 'groups'), {
                     name: newGroupName,
                     avatar: newGroupIsPrivate ? '🔒' : emojiMap[newGroupCategory],
                     category: newGroupCategory,
                     lastMessage: `Lobby created by ${userName}`,
                     lastMessageTime: 'Now',
                     membersCount: 1,
                     isPrivate: newGroupIsPrivate,
                     password: newGroupPassword,
                     createdAt: serverTimestamp()
                   });
                   setActiveGroupId(docRef.id);
                   setShowNewGroupModal(false);
                }} className="w-full py-4 bg-blue-600 font-bold rounded-2xl">Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`.pb-safe { padding-bottom: env(safe-area-inset-bottom); } .scrollbar-none::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

export default function SocioConnectApp() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('socioconnect_user');
    if (saved) setUserName(saved);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="h-[100dvh] w-full bg-black" />;
  
  return !userName ? (
    <NameEntryPage onEnter={(name) => { localStorage.setItem('socioconnect_user', name); setUserName(name); }} />
  ) : (
    <ChatApp userName={userName} onLogout={() => { localStorage.removeItem('socioconnect_user'); setUserName(null); }} />
  );
}