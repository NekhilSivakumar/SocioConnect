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
  Play,
  Pause,
  Key,
  ShieldCheck,
  Database,
  ArrowRight,
  Flame,
  Radio,
  Trash2,
  Calendar,
  HelpCircle,
  Copy
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

export default function WhatsAppSocioConnectPage() {
  const [groups, setGroups] = useState<FirestoreGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState<boolean>(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupHostel, setNewGroupHostel] = useState('VIT Outdoor Stadium');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Firebase Config Form State (for user to paste credentials directly)
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [projectIdInput, setProjectIdInput] = useState('');
  const [appIdInput, setAppIdInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Listen to Groups collection from Firestore (or local state if empty)
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
        console.log("Firestore groups listener fallback to local mode:", err);
      });
      return () => unsubscribe();
    }
  }, [isFirebaseConfigured]);

  // 2. Listen to Messages for the active group from Firestore
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
  }, [messages, isTyping]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeGroupId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: FirestoreMessage = {
      sender: 'me',
      senderName: 'You (Fresher)',
      text: text.trim(),
      timestamp: currentTime,
      status: 'delivered',
      createdAt: serverTimestamp()
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'groups', activeGroupId, 'messages'), newMsg);
        await setDoc(doc(db, 'groups', activeGroupId), {
          lastMessage: text.trim(),
          lastMessageTime: currentTime
        }, { merge: true });
      } catch (err) {
        console.error("Error writing to Firestore:", err);
      }
    } else {
      // Local reactive fallback
      const localMsg: FirestoreMessage = { ...newMsg, id: String(Date.now()) };
      setMessages(prev => [...prev, localMsg]);
      setGroups(prev => prev.map(g => g.id === activeGroupId ? {
        ...g,
        lastMessage: text.trim(),
        lastMessageTime: currentTime
      } : g));
    }

    setInputText('');

    // Simulate smart campus response
   

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
      lastMessage: `Group created by you: "${newGroupName}"`,
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
        // Add welcome message
        await addDoc(collection(db, 'groups', docRef.id, 'messages'), {
          sender: 'system',
          text: `🎉 Welcome to "${newGroupName}"! Start chatting or post a match invite.`,
          timestamp: currentTime,
          createdAt: serverTimestamp()
        });
        setActiveGroupId(docRef.id);
        triggerToast(`🚀 Group "${newGroupName}" created in Cloud Firestore!`);
      } catch (err) {
        console.error("Firestore creation error:", err);
      }
    } else {
      const generatedId = 'grp-' + Date.now();
      const localGroup: FirestoreGroup = { ...newGroupData, id: generatedId };
      setGroups([localGroup, ...groups]);
      setActiveGroupId(generatedId);
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'system',
          text: `🎉 Welcome to "${newGroupName}"! Start chatting or post a match invite.`,
          timestamp: currentTime
        }
      ]);
      triggerToast(`🚀 Group "${newGroupName}" created live!`);
    }

    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  // Seed sample groups if user wants to test quickly
  const handleSeedSampleGroups = async () => {
    const samples: FirestoreGroup[] = [
      {
        name: 'VIT Football Turf 5v5 (Gate 2)',
        avatar: '⚽',
        category: 'sports',
        categoryLabel: 'Sports Match',
        lastMessage: 'Match today at 5:45 PM. Need 2 more players!',
        lastMessageTime: '18:30',
        isGroup: true,
        membersCount: 8,
        hostelBlock: 'MH-G & MH-K Block',
        aboutText: 'Daily evening football turf matches for freshers & seniors. Respect game timings and bring shoes.',
        createdAt: serverTimestamp()
      },
      {
        name: 'Aditya Narayanan (4th Yr Senior)',
        avatar: '🎓',
        category: 'mentor',
        categoryLabel: 'Senior Mentor',
        lastMessage: 'For FFCS, make sure you keep slot B1 free on Tuesdays!',
        lastMessageTime: '18:15',
        isGroup: false,
        membersCount: 2,
        hostelBlock: 'MH-N Block',
        aboutText: '4th Year CSE Senior. Can help freshers with FFCS slot planning, teacher ratings, hackathons, and placement roadmaps.',
        createdAt: serverTimestamp()
      },
      {
        name: 'MH-K & MH-L Freshers Hangout',
        avatar: '🏢',
        category: 'hostel',
        categoryLabel: 'Hostel Hangout',
        lastMessage: 'Night canteen run around 10:30 PM? Who is up?',
        lastMessageTime: '17:45',
        isGroup: true,
        membersCount: 24,
        hostelBlock: 'MH-K / MH-L Block',
        aboutText: 'Common chat for freshers staying in MH-K and MH-L blocks. Sharing laundry timings, food deliveries, and gym buddies.',
        createdAt: serverTimestamp()
      }
    ];

    if (isFirebaseConfigured) {
      for (const sample of samples) {
        const docRef = await addDoc(collection(db, 'groups'), sample);
        await addDoc(collection(db, 'groups', docRef.id, 'messages'), {
          sender: 'them',
          senderName: sample.isGroup ? 'Group Host' : sample.name.split(' ')[0],
          text: sample.lastMessage,
          timestamp: sample.lastMessageTime,
          createdAt: serverTimestamp()
        });
      }
      triggerToast('✨ Seeded 3 starter groups to your Firestore database!');
    } else {
      const mapped = samples.map((s, idx) => ({ ...s, id: 'sample-' + idx }));
      setGroups(mapped);
      setActiveGroupId(mapped[0].id || null);
      triggerToast('✨ Sample VIT groups loaded!');
    }
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
    <div className="h-screen w-screen bg-[#f0f2f5] text-slate-800 flex flex-col overflow-hidden font-sans select-none">
      
      {/* Dynamic Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Window Container */}
      <div className="flex-1 flex overflow-hidden bg-white shadow-xl">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: CONVERSATIONS & CHAT LIST (LIGHT THEME) */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-[380px] lg:w-[410px] h-full flex flex-col border-r border-slate-200 bg-[#ffffff] shrink-0">
          
          {/* Top User Profile Bar */}
          <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 p-[2px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                    VIT
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-slate-900">SocioConnect</h2>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    VIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Fresher • MH-G Block</p>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowFirebaseModal(true)}
                title="Firebase Free Database Config"
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1"
              >
                <Database className={`w-4 h-4 ${isFirebaseConfigured ? 'text-emerald-600' : 'text-amber-500'}`} />
                <span className="text-[10px] font-bold hidden sm:inline">
                  {isFirebaseConfigured ? 'Live Cloud' : 'Free Spark'}
                </span>
              </button>

              <button
                onClick={() => setShowNewGroupModal(true)}
                title="Create New Campus Lobby"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new campus chat..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#f0f2f5] border border-transparent focus:border-emerald-500 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (with Motion layoutId) */}
          <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-slate-100 bg-[#f8fafc]">
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
                    isSelected ? 'text-white' : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-emerald-600 rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  💬
                </div>
                <h4 className="text-sm font-bold text-slate-700">0 Active Lobbies</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  The database is currently clean at zero. Create a lobby for sports, hostel hangouts, or senior connects!
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setShowNewGroupModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    + Create First Lobby
                  </button>
                  <button
                    onClick={handleSeedSampleGroups}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                  >
                    Load Sample VIT Groups
                  </button>
                </div>
              </div>
            ) : (
              filteredGroups.map(group => {
                const isActive = group.id === activeGroupId;
                return (
                  <motion.div
                    key={group.id}
                    onClick={() => setActiveGroupId(group.id || null)}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-all ${
                      isActive ? 'bg-[#f0fdf4] border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                        {group.avatar}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-emerald-900' : 'text-slate-900'}`}>
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
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : group.category === 'mentor'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {group.categoryLabel}
                        </span>
                        {group.hostelBlock && (
                          <span className="text-[9px] text-slate-400">
                            • {group.hostelBlock}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Bottom Bar: Stats & Reset */}
          <div className="p-3 border-t border-slate-200 bg-[#f8fafc] flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-medium">
              📊 {groups.length} Lobbies active on VIT campus
            </span>
            {groups.length > 0 && (
              <button
                onClick={handleResetToZero}
                title="Reset all groups to 0"
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to 0</span>
              </button>
            )}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* CENTER: ACTIVE CHAT CONVERSATION WINDOW (LIGHT THEME) */}
        {/* ========================================================================= */}
        <section className="flex-1 flex flex-col h-full bg-[#efeae2]/40 relative">
          
          {activeGroup ? (
            <>
              {/* Header */}
              <header className="h-16 px-4 md:px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-xs z-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowInfoSidebar(!showInfoSidebar)}>
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                    {activeGroup.avatar}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {activeGroup.name}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-medium">
                      {isTyping ? 'typing...' : `${activeGroup.membersCount} members • Online`}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-2 text-slate-600">
                  <button
                    onClick={() => triggerToast(`Calling ${activeGroup.name} via VIT Voice Room...`)}
                    title="Voice Call"
                    className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => triggerToast(`Starting Video Meet for ${activeGroup.name}...`)}
                    title="Video Call"
                    className="p-2.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    title="View Lobby Details"
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      showInfoSidebar ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Messages Container with Motion Transitions */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 bg-[#efeae2]/30">
                
                {/* Date Header */}
                <div className="flex justify-center my-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-500 shadow-xs">
                    Today • VIT Campus Real-Time Feed
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
                          <div className="max-w-md px-4 py-2 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-600 shadow-xs">
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
                              ? 'bg-[#d9fdd3] text-slate-900 rounded-br-none border border-emerald-200/60'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          {!isMe && msg.senderName && (
                            <p className="text-[10px] font-bold text-emerald-700 mb-1">
                              {msg.senderName}
                            </p>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>

                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              <span>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs w-fit"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestion Chips */}
              <div className="px-4 py-2 border-t border-slate-200 bg-white/90 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {[
                  'Count me in for the match! ⚽',
                  'What time are you free near Foodys?',
                  'Can you review my FFCS slots?',
                  'Joining the hackathon team 🚀'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Message Input Bottom Bar */}
              <footer className="p-3 md:p-4 border-t border-slate-200 bg-[#f8fafc] flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSendMessage("👍")}
                  title="Emoji"
                  className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  onClick={() => triggerToast("📎 File & Match invite attachment ready.")}
                  title="Attach File"
                  className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex-1 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeGroup.name}... (Press Enter)`}
                    className="flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                  />

                  {inputText.trim() ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendMessage("🎙️ [Voice note message: 0:15]")}
                      className="p-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-[#f8fafc]">
              <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-4xl mb-4 shadow-sm">
                👋
              </div>
              <h3 className="text-base font-bold text-slate-800">Select or Create a Campus Lobby</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Connect directly with freshers and senior mentors across VIT campus for sports, hostel hangouts, and hackathons.
              </p>
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                + Create New Lobby
              </button>
            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* RIGHT INFO SIDEBAR (LIGHT THEME) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {showInfoSidebar && activeGroup && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 330, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="h-full border-l border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0 shadow-sm"
            >
              <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc]">
                <h3 className="text-sm font-bold text-slate-900">Lobby Details</h3>
                <button
                  onClick={() => setShowInfoSidebar(false)}
                  className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-center border-b border-slate-100">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-4xl mb-3 shadow-xs">
                  {activeGroup.avatar}
                </div>
                <h4 className="text-base font-bold text-slate-900">{activeGroup.name}</h4>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">{activeGroup.categoryLabel}</p>
                {activeGroup.hostelBlock && (
                  <p className="text-[11px] text-slate-500 mt-1">📍 {activeGroup.hostelBlock}</p>
                )}
              </div>

              <div className="p-5 space-y-5 flex-1">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">About & Rules</h5>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    {activeGroup.aboutText}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Group Members ({activeGroup.membersCount || 8})
                  </h5>
                  <div className="space-y-2">
                    {[
                      { name: 'You (1st Year Fresher)', role: 'Admin', hostel: 'MH-G' },
                      { name: 'Devansh S.', role: 'Fresher', hostel: 'MH-G 204' },
                      { name: 'Aditya N.', role: '4th Yr Senior', hostel: 'MH-N' }
                    ].map((member, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-semibold text-slate-800">{member.name}</span>
                        <span className="text-[10px] text-slate-500">{member.role} • {member.hostel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Location</h5>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>VIT Vellore Main Campus (Indoor Complex / Turf 2)</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW LOBBY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Create Campus Lobby</h3>
                  <p className="text-xs text-slate-500">Instant matchmaking on Firestore database</p>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Lobby Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Badminton Doubles at 6 PM, MH-K Night Hangout"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Category:
                    </label>
                    <select
                      value={newGroupCategory}
                      onChange={(e) => setNewGroupCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="sports">Sports Match ⚽</option>
                      <option value="mentor">Senior Mentorship 🎓</option>
                      <option value="hostel">Hostel Hangout 🏢</option>
                      <option value="hackathon">Hackathon Squad 🚀</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Location / Hostel:
                    </label>
                    <input
                      type="text"
                      value={newGroupHostel}
                      onChange={(e) => setNewGroupHostel(e.target.value)}
                      placeholder="e.g. MH-G Block, Gate 2 Turf"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Description / Timings:
                  </label>
                  <textarea
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Provide details about timings, required equipment, or who can join..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewGroupModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Save & Publish Lobby
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: FIREBASE SPARK (100% FREE TIER) STATUS & CONFIG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFirebaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowFirebaseModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Firebase Spark Free Tier</h3>
                  <p className="text-xs text-slate-500">100% Free • 0 Charges guaranteed</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2 mb-4">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Spark Plan Limits (Never pay a dime):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  <li><strong>50,000 free reads</strong> & <strong>20,000 free writes</strong> per day.</li>
                  <li><strong>1 GB</strong> free Cloud Firestore storage.</li>
                  <li>Real-time syncing with zero billing credentials required.</li>
                </ul>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  To link your live Firebase project, paste your credentials into a <code>.env.local</code> file in the project folder:
                </p>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] space-y-1 overflow-x-auto select-text">
                  <p>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...</p>
                  <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id</p>
                  <p>NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
                <button
                  onClick={() => setShowFirebaseModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}



