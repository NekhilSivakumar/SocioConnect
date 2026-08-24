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

type PrivacyFields = { isPrivate?: boolean; password?: string; };
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

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length >= 2) onEnter(cleanName);
  };

  return (
    <div className="app-font h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-black via-blue-950 to-neutral-950 relative overflow-hidden px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-900/50">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white text-center tracking-tight mb-1">SocioConnect</h1>
          <p className="text-xs text-blue-200/50 text-center mb-8 font-medium">Instant Community Messaging</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="w-4 h-4 text-blue-200/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 focus:bg-white/[0.07] transition-all" />
            </div>
            <button disabled={name.trim().length < 2} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40">
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
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState<boolean>(false);
  const [newGroupPassword, setNewGroupPassword] = useState('');
  
  // PASSWORD STATES
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

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    setIsDeletingGroup(true);
    try {
      const messagesSnap = await getDocs(collection(db, 'groups', groupId, 'messages'));
      await Promise.all(messagesSnap.docs.map((msgDoc) => deleteDoc(msgDoc.ref)));
      await deleteDoc(doc(db, 'groups', groupId));
      triggerToast(`🗑️ Lobby "${groupName}" deleted`);
      setActiveGroupId(null);
      setShowInfoSidebar(false);
    } catch (err) { triggerToast(`⚠️ Error deleting lobby`); }
    setIsDeletingGroup(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeGroupId) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await addDoc(collection(db, 'groups', activeGroupId, 'messages'), {
        sender: 'user', senderName: userName, text: inputText.trim(), timestamp: time, status: 'sent', createdAt: serverTimestamp()
      });
      await setDoc(doc(db, 'groups', activeGroupId), { lastMessage: `${userName}: ${inputText.trim()}`, lastMessageTime: time }, { merge: true });
      setInputText('');
    } catch (err) { console.error(err); }
  };

  const handleUnlockLobby = () => {
    if (passwordPromptGroup && passwordAttempt === passwordPromptGroup.password) {
      setUnlockedGroups(prev => new Set(prev).add(passwordPromptGroup.id!));
      setActiveGroupId(passwordPromptGroup.id!);
      setPasswordPromptGroup(null);
      setPasswordAttempt('');
    } else {
      alert("Incorrect Password");
    }
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
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">{userName.slice(0,1).toUpperCase()}</div>
              <h2 className="font-bold text-sm">{userName}</h2>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setShowNewGroupModal(true)} className="p-2.5 rounded-full bg-white text-black active:scale-90 transition-transform"><Plus size={20} /></button>
              <button onClick={onLogout} className="p-2.5 rounded-full bg-neutral-900 text-neutral-400"><LogOut size={18} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {groups.map(group => (
              <div key={group.id} onClick={() => group.isPrivate && !unlockedGroups.has(group.id!) ? setPasswordPromptGroup(group) : setActiveGroupId(group.id!)} className="p-4 flex items-center gap-4 active:bg-neutral-900 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-2xl shrink-0">{group.isPrivate && !unlockedGroups.has(group.id!) ? '🔒' : group.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{group.name}</h3>
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
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <footer className="p-3 border-t border-neutral-900 flex gap-2">
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-neutral-900 rounded-2xl py-3 px-4 text-sm outline-none" />
                <button onClick={handleSendMessage} className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shrink-0"><Send size={18} /></button>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <h3 className="font-bold">Welcome to SocioConnect</h3>
              <p className="text-xs text-neutral-500 mt-2">Pick a lobby to start chatting.</p>
            </div>
          )}
        </section>

        {/* INFO SIDEBAR */}
        <AnimatePresence>
          {showInfoSidebar && activeGroup && (
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 z-40 w-full sm:w-[320px] md:static md:w-[320px] h-full border-l border-neutral-900 bg-neutral-950 flex flex-col">
               <div className="h-16 px-4 border-b border-neutral-900 flex items-center justify-between">
                <h3 className="text-sm font-bold">Lobby Info</h3>
                <button onClick={() => setShowInfoSidebar(false)}><X size={18} /></button>
              </div>
              <div className="p-8 text-center border-b border-neutral-900">
                <div className="w-20 h-20 rounded-3xl bg-neutral-900 mx-auto flex items-center justify-center text-4xl mb-4">{activeGroup.avatar}</div>
                <h4 className="font-bold">{activeGroup.name}</h4>
              </div>
              <div className="p-6">
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-3 bg-red-950/20 border border-red-900/30 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2"><Trash2 size={14} /> Delete Lobby</button>
                ) : (
                  <div className="bg-red-950/10 p-4 rounded-xl border border-red-900/20 text-center">
                    <p className="text-[11px] text-red-400 mb-3">Permanent delete?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-neutral-900 rounded-lg text-xs">No</button>
                      <button onClick={() => handleDeleteGroup(activeGroup.id!, activeGroup.name)} disabled={isDeletingGroup} className="flex-1 py-2 bg-red-600 rounded-lg text-xs font-bold">Yes</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS: CREATE & PASSWORD */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="w-full max-w-md bg-neutral-950 rounded-[2rem] p-6 border border-neutral-800">
              <h3 className="font-bold mb-4">Create Lobby</h3>
              <div className="space-y-4">
                <input placeholder="Lobby Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-neutral-900 rounded-xl p-4 text-sm" />
                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl text-sm">
                  <span>Private Lobby</span>
                  <input type="checkbox" checked={newGroupIsPrivate} onChange={(e) => setNewGroupIsPrivate(e.target.checked)} className="w-5 h-5" />
                </div>
                {newGroupIsPrivate && <input type="password" placeholder="Set Password" value={newGroupPassword} onChange={(e) => setNewGroupPassword(e.target.value)} className="w-full bg-neutral-900 rounded-xl p-4 text-sm" />}
                <button onClick={async () => {
                  const docRef = await addDoc(collection(db, 'groups'), {
                    name: newGroupName, avatar: newGroupIsPrivate ? '🔒' : '💬', category: newGroupCategory, lastMessage: 'Created', lastMessageTime: 'Now', isPrivate: newGroupIsPrivate, password: newGroupPassword, createdAt: serverTimestamp()
                  });
                  setActiveGroupId(docRef.id);
                  setShowNewGroupModal(false);
                }} className="w-full py-4 bg-blue-600 font-bold rounded-2xl">Create Lobby</button>
              </div>
            </motion.div>
          </div>
        )}

        {passwordPromptGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xs text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-1">Private Lobby</h3>
              <p className="text-xs text-neutral-500 mb-6">Enter password for "{passwordPromptGroup.name}"</p>
              <input type="password" autoFocus className="w-full bg-neutral-900 rounded-xl p-4 text-center text-sm mb-4 outline-none border border-neutral-800 focus:border-blue-500" placeholder="••••" value={passwordAttempt} onChange={(e) => setPasswordAttempt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUnlockLobby()} />
              <div className="flex gap-2">
                <button onClick={() => setPasswordPromptGroup(null)} className="flex-1 py-3 text-xs font-bold text-neutral-500">Cancel</button>
                <button onClick={handleUnlockLobby} className="flex-1 py-3 bg-white text-black rounded-xl text-xs font-bold">Unlock</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
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