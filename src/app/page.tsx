'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Users,
  Search,
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  Trophy,
  GraduationCap,
  Sparkles,
  CheckCheck,
  Check,
  Plus,
  MapPin,
  Clock,
  Info,
  X,
  Database,
  Trash2,
  ArrowRight,
  User,
  LogOut
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
  deleteDoc
} from 'firebase/firestore';

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
    if (name.trim().length >= 2) {
      onEnter(name.trim());
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-700 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -25, 35, 0], y: [0, 30, -25, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 15, -15, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[80px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 sm:p-10 shadow-2xl">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center shadow-xl shadow-blue-500/30"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-black text-white text-center tracking-tight mb-2"
          >
            SocioConnect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-teal-100/80 text-center mb-8 font-medium"
          >
            Connect with freshers & seniors across VIT campus
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-xs font-bold text-teal-100 uppercase tracking-wider block mb-2">
                What should we call you?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-teal-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={30}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-teal-200/50 focus:outline-none focus:border-teal-300 focus:bg-white/15 transition-all backdrop-blur-sm"
                />
              </div>
              {name.length > 0 && name.length < 2 && (
                <p className="text-[11px] text-amber-300 mt-1.5 ml-1">Name must be at least 2 characters</p>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={name.trim().length < 2}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                name.trim().length >= 2
                  ? 'bg-white text-blue-700 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              <span>Enter SocioConnect</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Features Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {['⚽ Sports', '🎓 Mentors', '🏢 Hostels', '🚀 Hackathons'].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-teal-100"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-teal-200/50 mt-5">
          100% Free • Powered by Firebase Spark
        </p>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MAIN CHAT APPLICATION
// ─────────────────────────────────────────────────────────────────────
function ChatApp({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  const [groups, setGroups] = useState<FirestoreGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupHostel, setNewGroupHostel] = useState('VIT Outdoor Stadium');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Listen to Groups collection from Firestore
  useEffect(() => {
    if (isFirebaseConfigured) {
      const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedGroups: FirestoreGroup[] = [];
        snapshot.forEach((docSnap) => {
          fetchedGroups.push({ id: docSnap.id, ...docSnap.data() } as FirestoreGroup);
        });
        setGroups(fetchedGroups);
        if (fetchedGroups.length > 0 && !activeGroupId) {
          setActiveGroupId(fetchedGroups[0].id || null);
        }
      }, (err) => {
        console.log("Firestore groups listener fallback:", err);
      });
      return () => unsubscribe();
    }
  }, [isFirebaseConfigured]);

  // Listen to Messages for the active group from Firestore
  useEffect(() => {
    if (!activeGroupId) {
      setMessages([]);
      return;
    }

    if (isFirebaseConfigured) {
      const messagesRef = collection(db, 'groups', activeGroupId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMsgs: FirestoreMessage[] = [];
        snapshot.forEach((docSnap) => {
          fetchedMsgs.push({ id: docSnap.id, ...docSnap.data() } as FirestoreMessage);
        });
        setMessages(fetchedMsgs);
      }, (err) => {
        console.log("Firestore messages listener fallback:", err);
      });
      return () => unsubscribe();
    }
  }, [activeGroupId, isFirebaseConfigured]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  // Handle Send Message — real messages only, no auto-replies
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeGroupId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: FirestoreMessage = {
      sender: 'me',
      senderName: userName,
      text: text.trim(),
      timestamp: currentTime,
      status: 'delivered',
      createdAt: serverTimestamp()
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'groups', activeGroupId, 'messages'), newMsg);
        await setDoc(doc(db, 'groups', activeGroupId), {
          lastMessage: `${userName}: ${text.trim()}`,
          lastMessageTime: currentTime
        }, { merge: true });
      } catch (err) {
        console.error("Error writing to Firestore:", err);
      }
    } else {
      const localMsg: FirestoreMessage = { ...newMsg, id: String(Date.now()) };
      setMessages(prev => [...prev, localMsg]);
      setGroups(prev => prev.map(g => g.id === activeGroupId ? {
        ...g,
        lastMessage: `${userName}: ${text.trim()}`,
        lastMessageTime: currentTime
      } : g));
    }

    setInputText('');
  };

  // Handle Create Group in Firestore
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const emojiMap: Record<string, string> = {
      sports: '⚽',
      mentor: '🎓',
      hostel: '🏢',
      hackathon: '🚀'
    };

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newGroupData: FirestoreGroup = {
      name: newGroupName.trim(),
      avatar: emojiMap[newGroupCategory] || '💬',
      category: newGroupCategory,
      categoryLabel: newGroupCategory === 'sports' ? 'Sports Match' : newGroupCategory === 'mentor' ? 'Senior Mentor' : newGroupCategory === 'hostel' ? 'Hostel Hangout' : 'Hackathon Squad',
      lastMessage: `${userName} created this lobby`,
      lastMessageTime: currentTime,
      isGroup: true,
      membersCount: 1,
      hostelBlock: newGroupHostel,
      aboutText: newGroupDesc || 'New community group for VIT campus connection.',
      createdAt: serverTimestamp()
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'groups'), newGroupData);
        await addDoc(collection(db, 'groups', docRef.id, 'messages'), {
          sender: 'system',
          text: `🎉 ${userName} created "${newGroupName}". Start chatting!`,
          timestamp: currentTime,
          createdAt: serverTimestamp()
        });
        setActiveGroupId(docRef.id);
        triggerToast(`🚀 "${newGroupName}" is now live!`);
      } catch (err) {
        console.error("Firestore creation error:", err);
      }
    } else {
      const generatedId = 'grp-' + Date.now();
      const localGroup: FirestoreGroup = { ...newGroupData, id: generatedId };
      setGroups([localGroup, ...groups]);
      setActiveGroupId(generatedId);
      setMessages([{
        id: 'welcome-' + Date.now(),
        sender: 'system',
        text: `🎉 ${userName} created "${newGroupName}". Start chatting!`,
        timestamp: currentTime
      }]);
      triggerToast(`🚀 "${newGroupName}" is now live!`);
    }

    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handleResetToZero = () => {
    setGroups([]);
    setActiveGroupId(null);
    setMessages([]);
    triggerToast('🧹 All groups and chats reset to zero!');
  };

  const filteredGroups = groups.filter(g => {
    const matchesFilter = filterCategory === 'all' || g.category === filterCategory;
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-700 text-slate-800 flex flex-col overflow-hidden font-sans select-none">

      {/* Dynamic Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-6 z-50 bg-gradient-to-r from-cyan-50/95 to-blue-50/95 backdrop-blur-xl text-blue-800 px-4 py-3 rounded-2xl shadow-xl border border-blue-200 flex items-center gap-2.5 text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container with glass effect */}
      <div className="flex-1 flex overflow-hidden m-2 sm:m-3 rounded-2xl bg-gradient-to-br from-cyan-50/95 via-white/95 to-blue-50/95 backdrop-blur-xl shadow-2xl border border-cyan-100/60">

        {/* ═══════════════════════════════════════════════ */}
        {/* LEFT SIDEBAR */}
        {/* ═══════════════════════════════════════════════ */}
        <aside className="w-full md:w-[370px] lg:w-[400px] h-full flex flex-col border-r border-teal-100/50 bg-gradient-to-b from-cyan-50 to-blue-100/40 shrink-0">

          {/* Top User Bar */}
          <div className="h-16 px-4 border-b border-teal-100/60 flex items-center justify-between bg-gradient-to-r from-cyan-600 to-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-black text-white uppercase">
                {userName.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{userName}</h2>
                <p className="text-[10px] text-teal-100">Online • VIT Campus</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNewGroupModal(true)}
                title="Create New Lobby"
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                title="Change Name"
                className="p-2 rounded-xl hover:bg-white/15 text-teal-100 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-cyan-100/40 bg-cyan-50/50">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-teal-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lobbies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-blue-50/60 border border-blue-200/50 focus:border-blue-400 focus:bg-white text-xs text-slate-800 placeholder:text-blue-400/70 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 text-teal-400 hover:text-teal-600 text-xs">✕</button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-cyan-100/40 bg-blue-50/40">
            {[
              { id: 'all', label: 'All Lobbies' },
              { id: 'sports', label: '⚽ Sports' },
              { id: 'mentor', label: '🎓 Seniors' },
              { id: 'hostel', label: '🏢 Hostels' },
              { id: 'hackathon', label: '🚀 Hackathons' }
            ].map(tab => {
              const isSelected = filterCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`relative px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected ? 'text-white' : 'text-blue-700 hover:bg-blue-100/60'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-cyan-100/30 bg-cyan-50/30">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-blue-200 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  💬
                </div>
                <h4 className="text-sm font-bold text-slate-700">0 Active Lobbies</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Database is clean at zero. Create a lobby to get started!
                </p>
                <button
                  onClick={() => setShowNewGroupModal(true)}
                  className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  + Create First Lobby
                </button>
              </div>
            ) : (
              filteredGroups.map(group => {
                const isActive = group.id === activeGroupId;
                return (
                  <motion.div
                    key={group.id}
                    onClick={() => setActiveGroupId(group.id || null)}
                    whileHover={{ backgroundColor: 'rgba(204, 251, 241, 0.4)' }}
                    className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-all ${
                      isActive ? 'bg-blue-100/50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-blue-200/60 flex items-center justify-center text-xl shadow-xs shrink-0">
                      {group.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-blue-800' : 'text-slate-800'}`}>
                          {group.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                          {group.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate pr-2">
                        {group.lastMessage}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          group.category === 'sports'
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                            : group.category === 'mentor'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {group.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Bottom Stats */}
          <div className="p-3 border-t border-cyan-100/50 bg-blue-50/40 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-medium">📊 {groups.length} Lobbies</span>
            {groups.length > 0 && (
              <button
                onClick={handleResetToZero}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════ */}
        {/* CENTER: CHAT WINDOW */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="flex-1 flex flex-col h-full bg-gradient-to-b from-cyan-50/40 to-blue-50/20 relative">

          {activeGroup ? (
            <>
              {/* Header */}
              <header className="h-16 px-4 md:px-6 border-b border-cyan-100/50 bg-cyan-50/70 backdrop-blur-md flex items-center justify-between shrink-0 shadow-xs z-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowInfoSidebar(!showInfoSidebar)}>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-blue-200 flex items-center justify-center text-xl shadow-xs">
                    {activeGroup.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">{activeGroup.name}</h3>
                    <p className="text-[11px] text-blue-600 font-medium">{activeGroup.membersCount} members</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 text-slate-500">
                  <button onClick={() => triggerToast(`Calling ${activeGroup.name}...`)} className="p-2.5 rounded-xl hover:bg-blue-100/60 hover:text-blue-700 transition-all cursor-pointer">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button onClick={() => triggerToast(`Video call for ${activeGroup.name}...`)} className="p-2.5 rounded-xl hover:bg-blue-100/60 hover:text-blue-700 transition-all cursor-pointer">
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      showInfoSidebar ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'hover:bg-blue-100/60 hover:text-blue-700'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                <div className="flex justify-center my-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100/60 border border-blue-200/50 text-blue-600 shadow-xs">
                    Today • VIT Campus
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {messages.map(msg => {
                    if (msg.sender === 'system') {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-center my-2"
                        >
                          <div className="max-w-md px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200/50 text-center text-xs text-blue-700 shadow-xs">
                            {msg.text}
                          </div>
                        </motion.div>
                      );
                    }

                    const isMe = msg.sender === 'me';

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative ${
                            isMe
                              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none'
                              : 'bg-blue-50/70 border border-blue-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          {/* Sender name on every message */}
                          {msg.senderName && (
                            <p className={`text-[10px] font-bold mb-1 ${
                              isMe ? 'text-cyan-100' : 'text-blue-600'
                            }`}>
                              {msg.senderName}
                            </p>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>

                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-cyan-100' : 'text-slate-400'}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              <span>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-cyan-200" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chips */}
              <div className="px-4 py-2 border-t border-cyan-100/40 bg-cyan-50/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {[
                  'Count me in! ⚽',
                  'What time?',
                  'Where should we meet?',
                  'I am joining 🚀'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-blue-700 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <footer className="p-3 md:p-4 border-t border-cyan-100/50 bg-cyan-50/60 backdrop-blur-sm flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSendMessage("👍")}
                  className="p-2.5 rounded-xl hover:bg-blue-100/60 text-blue-500 cursor-pointer"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex-1 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message as ${userName}...`}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-50/50 border border-blue-200/50 text-xs sm:text-sm text-slate-800 placeholder:text-blue-400/60 focus:outline-none focus:border-blue-400 focus:bg-white shadow-xs transition-all"
                  />
                  {inputText.trim() ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendMessage("🎙️ Voice note")}
                      className="p-3 rounded-xl bg-blue-100/60 hover:bg-blue-200/60 text-blue-600 transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-blue-200 flex items-center justify-center text-4xl mb-4 shadow-sm"
              >
                👋
              </motion.div>
              <h3 className="text-base font-bold text-slate-700">Hey {userName}! Select or create a lobby</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Connect with freshers and seniors for sports, hostels, and hackathons.
              </p>
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:shadow-lg"
              >
                + Create New Lobby
              </button>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* RIGHT INFO DRAWER */}
        {/* ═══════════════════════════════════════════════ */}
        <AnimatePresence>
          {showInfoSidebar && activeGroup && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="h-full border-l border-cyan-100/50 bg-gradient-to-b from-cyan-50 to-blue-50 flex flex-col overflow-y-auto shrink-0"
            >
              <div className="h-16 px-4 border-b border-cyan-100/50 flex items-center justify-between bg-blue-50/40">
                <h3 className="text-sm font-bold text-slate-800">Lobby Info</h3>
                <button onClick={() => setShowInfoSidebar(false)} className="p-2 rounded-xl hover:bg-blue-100/60 text-slate-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-center border-b border-cyan-100/40">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 border border-blue-200 mx-auto flex items-center justify-center text-4xl mb-3 shadow-sm">
                  {activeGroup.avatar}
                </div>
                <h4 className="text-base font-bold text-slate-800">{activeGroup.name}</h4>
                <p className="text-xs text-blue-600 font-bold mt-0.5">{activeGroup.categoryLabel}</p>
                {activeGroup.hostelBlock && (
                  <p className="text-[11px] text-slate-500 mt-1">📍 {activeGroup.hostelBlock}</p>
                )}
              </div>

              <div className="p-5 space-y-5 flex-1">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">About</h5>
                  <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                    {activeGroup.aboutText}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Location</h5>
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-200/50 text-xs text-blue-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-blue-500" />
                    <span>VIT Vellore Main Campus</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW LOBBY */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-blue-100/60 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 text-blue-600">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Create Campus Lobby</h3>
                  <p className="text-xs text-slate-500">by {userName} • Saved to Firestore</p>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Lobby Title:</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Badminton Doubles at 6 PM"
                    className="w-full rounded-xl bg-blue-50/40 border border-blue-200/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Category:</label>
                    <select
                      value={newGroupCategory}
                      onChange={(e) => setNewGroupCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-blue-50/40 border border-blue-200/50 p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="sports">Sports Match ⚽</option>
                      <option value="mentor">Senior Mentorship 🎓</option>
                      <option value="hostel">Hostel Hangout 🏢</option>
                      <option value="hackathon">Hackathon Squad 🚀</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Location:</label>
                    <input
                      type="text"
                      value={newGroupHostel}
                      onChange={(e) => setNewGroupHostel(e.target.value)}
                      placeholder="e.g. MH-G Block"
                      className="w-full rounded-xl bg-blue-50/40 border border-blue-200/50 p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Description:</label>
                  <textarea
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Details about timings, rules, or who can join..."
                    className="w-full rounded-xl bg-blue-50/40 border border-blue-200/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-blue-100/50 mt-6">
                  <button type="button" onClick={() => setShowNewGroupModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 cursor-pointer hover:shadow-lg">
                    Create Lobby
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ROOT COMPONENT: NAME GATE → CHAT APP
// ─────────────────────────────────────────────────────────────────────
export default function SocioConnectApp() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore name from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('socioconnect_username');
    if (saved) {
      setUserName(saved);
    }
    setIsLoading(false);
  }, []);

  const handleEnterName = (name: string) => {
    localStorage.setItem('socioconnect_username', name);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('socioconnect_username');
    setUserName(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!userName) {
    return <NameEntryPage onEnter={handleEnterName} />;
  }

  return <ChatApp userName={userName} onLogout={handleLogout} />;
}
