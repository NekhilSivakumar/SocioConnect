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
// PRIVATE LOBBY SUPPORT
// ─────────────────────────────────────────────────────────────────────
// NOTE: FirestoreGroup lives in '@/lib/firebase' and doesn't know about
// these fields yet. For full type-safety, add:
//   isPrivate?: boolean;
//   password?: string;
// to the FirestoreGroup interface in lib/firebase.ts. Until then this
// local type is used wherever we read/write those two fields.
//
// SECURITY NOTE: the lobby password is stored in PLAINTEXT (by request,
// so the app owner can view it directly in the Firestore console). This
// means it is visible not just to the owner but to anyone who can read
// the `groups` collection — which, with this app's current open
// listener/rules, is anyone using the app. Treat these as low-stakes
// "keep casual visitors out" passwords, not real secrets.
type PrivacyFields = {
  isPrivate?: boolean;
  password?: string;
};
type PrivateGroup = FirestoreGroup & PrivacyFields;

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .app-font { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    <div className="app-font h-[100dvh] w-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -25, 35, 0], y: [0, 30, -25, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 15, -15, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -tranneutral-x-1/2 -tranneutral-y-1/2 w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px]"
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
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-white/10"
          >
            <MessageSquare className="w-10 h-10 text-black" />
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
            className="text-sm text-white/60 text-center mb-8 font-medium"
          >
            Connect with freshers & seniors across VIT campus
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">
                What should we call you?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -tranneutral-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={30}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all backdrop-blur-sm"
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
                  ? 'bg-white text-black shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
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
                className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-white/70"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-5">
          100% Free • Powered by Firebase Spark
        </p>
      </motion.div>
    </div>
    </>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupHostel, setNewGroupHostel] = useState('VIT Outdoor Stadium');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState<boolean>(false);
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [showNewGroupPassword, setShowNewGroupPassword] = useState<boolean>(false);
  const [newGroupPasswordError, setNewGroupPasswordError] = useState<string | null>(null);

  // Private Lobby Unlock State
  // Groups the user has already unlocked this session (id set) —
  // resets on refresh, so re-entering always re-prompts.
  const [unlockedGroups, setUnlockedGroups] = useState<Set<string>>(new Set());
  const [passwordPromptGroup, setPasswordPromptGroup] = useState<PrivateGroup | null>(null);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [showPasswordAttempt, setShowPasswordAttempt] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState<boolean>(false);

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
        const fetchedGroups: PrivateGroup[] = [];
        snapshot.forEach((docSnap) => {
          fetchedGroups.push({ id: docSnap.id, ...docSnap.data() } as PrivateGroup);
        });
        setGroups(fetchedGroups);
        if (fetchedGroups.length > 0 && !activeGroupId && !fetchedGroups[0].isPrivate) {
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

  // Reset any pending delete confirmation when switching groups
  useEffect(() => {
    setShowDeleteConfirm(false);
  }, [activeGroupId]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  // Clicking a lobby in the sidebar routes through here: private lobbies
  // the user hasn't unlocked this session get a password prompt instead
  // of opening the chat directly.
  const openGroup = (group: PrivateGroup) => {
    if (!group.id) return;
    if (group.isPrivate && !unlockedGroups.has(group.id)) {
      setPasswordPromptGroup(group);
      setPasswordAttempt('');
      setPasswordError(null);
      setShowPasswordAttempt(false);
    } else {
      setActiveGroupId(group.id);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordPromptGroup?.id) return;

    setIsVerifyingPassword(true);
    setPasswordError(null);

    if (passwordAttempt === passwordPromptGroup.password) {
      setUnlockedGroups(prev => new Set(prev).add(passwordPromptGroup.id as string));
      setActiveGroupId(passwordPromptGroup.id);
      setPasswordPromptGroup(null);
      setPasswordAttempt('');
    } else {
      setPasswordError('Incorrect password — try again');
    }

    setIsVerifyingPassword(false);
  };

  // Handle Send Message — real messages only, no auto-replies
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeGroupId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: FirestoreMessage = {
      // NOTE: this field is no longer used to decide left/right alignment —
      // that's computed per-viewer from senderName vs. the logged-in
      // userName (see isMe below). Kept as 'them' just to satisfy the
      // FirestoreMessage type shape; 'system' is still used separately.
      sender: 'them',
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

    setNewGroupPasswordError(null);
    if (newGroupIsPrivate) {
      if (newGroupPassword.trim().length < 4) {
        setNewGroupPasswordError('Password must be at least 4 characters');
        return;
      }
    }

    const emojiMap: Record<string, string> = {
      sports: '⚽',
      mentor: '🎓',
      hostel: '🏢',
      hackathon: '🚀'
    };

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const plainPassword = newGroupIsPrivate ? newGroupPassword.trim() : undefined;

    const newGroupData: PrivateGroup = {
      name: newGroupName.trim(),
      avatar: newGroupIsPrivate ? '🔒' : (emojiMap[newGroupCategory] || '💬'),
      category: newGroupCategory,
      categoryLabel: newGroupCategory === 'sports' ? 'Sports Match' : newGroupCategory === 'mentor' ? 'Senior Mentor' : newGroupCategory === 'hostel' ? 'Hostel Hangout' : 'Hackathon Squad',
      lastMessage: `${userName} created this lobby`,
      lastMessageTime: currentTime,
      isGroup: true,
      membersCount: 1,
      hostelBlock: newGroupHostel,
      aboutText: newGroupDesc || 'New community group for VIT campus connection.',
      createdAt: serverTimestamp(),
      isPrivate: newGroupIsPrivate,
      ...(plainPassword ? { password: plainPassword } : {})
    };

    let newGroupId: string | null = null;

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'groups'), newGroupData);
        await addDoc(collection(db, 'groups', docRef.id, 'messages'), {
          sender: 'system',
          text: `🎉 ${userName} created "${newGroupName}". Start chatting!`,
          timestamp: currentTime,
          createdAt: serverTimestamp()
        });
        newGroupId = docRef.id;
        setActiveGroupId(docRef.id);
        triggerToast(newGroupIsPrivate ? `🔒 "${newGroupName}" is now live and locked!` : `🚀 "${newGroupName}" is now live!`);
      } catch (err) {
        console.error("Firestore creation error:", err);
      }
    } else {
      const generatedId = 'grp-' + Date.now();
      const localGroup: PrivateGroup = { ...newGroupData, id: generatedId };
      setGroups([localGroup, ...groups]);
      newGroupId = generatedId;
      setActiveGroupId(generatedId);
      setMessages([{
        id: 'welcome-' + Date.now(),
        sender: 'system',
        text: `🎉 ${userName} created "${newGroupName}". Start chatting!`,
        timestamp: currentTime
      }]);
      triggerToast(newGroupIsPrivate ? `🔒 "${newGroupName}" is now live and locked!` : `🚀 "${newGroupName}" is now live!`);
    }

    // The creator already knows the password they just set — unlock it
    // for them immediately instead of re-prompting in the same session.
    if (newGroupId && newGroupIsPrivate) {
      setUnlockedGroups(prev => new Set(prev).add(newGroupId as string));
    }

    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupIsPrivate(false);
    setNewGroupPassword('');
    setNewGroupPasswordError(null);
  };

  const handleResetToZero = () => {
    setGroups([]);
    setActiveGroupId(null);
    setMessages([]);
    triggerToast('🧹 All groups and chats reset to zero!');
  };

  // Permanently delete a single group — pushes the removal to Firestore
  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    setIsDeletingGroup(true);

    if (isFirebaseConfigured) {
      try {
        // Firestore doesn't cascade-delete subcollections, so clear the
        // group's messages first, then remove the group document itself.
        const messagesRef = collection(db, 'groups', groupId, 'messages');
        const messagesSnap = await getDocs(messagesRef);
        await Promise.all(messagesSnap.docs.map((msgDoc) => deleteDoc(msgDoc.ref)));
        await deleteDoc(doc(db, 'groups', groupId));
        triggerToast(`🗑️ "${groupName}" permanently deleted`);
      } catch (err) {
        console.error("Error deleting group from Firestore:", err);
        triggerToast(`⚠️ Couldn't delete "${groupName}" — try again`);
        setIsDeletingGroup(false);
        return;
      }
    } else {
      setGroups(prev => prev.filter(g => g.id !== groupId));
      triggerToast(`🗑️ "${groupName}" deleted`);
    }

    // Local UI cleanup happens regardless of persistence path —
    // for Firestore-backed groups the onSnapshot listener will also
    // sync this once the delete propagates, but we clear it immediately
    // for a responsive feel.
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
      setMessages([]);
    }
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setShowInfoSidebar(false);
    setShowDeleteConfirm(false);
    setIsDeletingGroup(false);
  };

  const filteredGroups = groups.filter(g => {
    const matchesFilter = filterCategory === 'all' || g.category === filterCategory;
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .app-font { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    <div className="app-font h-[100dvh] w-screen bg-black text-neutral-100 flex flex-col overflow-hidden select-none">

      {/* Dynamic Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-6 z-50 bg-neutral-900/95 backdrop-blur-xl text-neutral-200 px-4 py-3 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-2.5 text-xs font-medium"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container with glass effect */}
      <div className="flex-1 flex overflow-hidden m-2 sm:m-3 rounded-2xl bg-neutral-950/95 backdrop-blur-xl shadow-2xl border border-neutral-800">

        {/* ═══════════════════════════════════════════════ */}
        {/* LEFT SIDEBAR */}
        {/* ═══════════════════════════════════════════════ */}
        <aside className={`${activeGroupId ? 'hidden' : 'flex'} md:flex w-full md:w-[370px] lg:w-[400px] h-full flex-col border-r border-neutral-800 bg-neutral-950 shrink-0`}>

          {/* Top User Bar */}
          <div className="h-16 px-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-black text-white uppercase">
                {userName.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{userName}</h2>
                <p className="text-[10px] text-neutral-400">Online • VIT Campus</p>
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
                className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-neutral-800 bg-neutral-900/60">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lobbies..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700 focus:border-white/30 focus:bg-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 text-neutral-500 hover:text-neutral-300 text-xs">✕</button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-neutral-800 bg-neutral-900/40">
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
                    isSelected ? 'text-white' : 'text-neutral-300 hover:bg-neutral-800/60'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 bg-neutral-900/20">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
                  💬
                </div>
                <h4 className="text-sm font-bold text-neutral-200">0 Active Lobbies</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                  Database is clean at zero. Create a lobby to get started!
                </p>
                <button
                  onClick={() => setShowNewGroupModal(true)}
                  className="mt-4 px-5 py-2 rounded-xl bg-white text-black text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  + Create First Lobby
                </button>
              </div>
            ) : (
              filteredGroups.map(group => {
                const isActive = group.id === activeGroupId;
                const isLocked = !!group.isPrivate && !(group.id && unlockedGroups.has(group.id));
                return (
                  <motion.div
                    key={group.id}
                    onClick={() => openGroup(group)}
                    whileHover={{ backgroundColor: 'rgba(30, 64, 84, 0.5)' }}
                    className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-all ${
                      isActive ? 'bg-neutral-800/70 border-l-4 border-white' : ''
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl shadow-xs shrink-0">
                      {group.avatar}
                      {group.isPrivate && (
                        <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-neutral-200'}`}>
                          {group.name}
                        </h3>
                        <span className="text-[10px] text-neutral-500 font-medium shrink-0 ml-2">
                          {group.lastMessageTime}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate pr-2 ${isLocked ? 'text-neutral-500 italic' : 'text-neutral-400'}`}>
                        {isLocked ? '🔒 Locked — enter password to view' : group.lastMessage}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          group.category === 'sports'
                            ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                            : group.category === 'mentor'
                            ? 'bg-neutral-800 text-neutral-200 border-neutral-600'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800'
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
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-between text-xs text-neutral-400">
            <span className="text-[11px] font-medium">📊 {groups.length} Lobbies</span>
            {groups.length > 0 && (
              <button
                onClick={handleResetToZero}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
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
        <section className={`${activeGroupId ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full bg-neutral-950 relative`}>

          {activeGroup ? (
            <>
              {/* Header */}
              <header className="h-16 px-3 md:px-6 border-b border-neutral-800 bg-neutral-900/70 backdrop-blur-md flex items-center justify-between shrink-0 shadow-xs z-10">
                <div className="flex items-center gap-1 min-w-0">
                  <button
                    onClick={() => setActiveGroupId(null)}
                    className="md:hidden p-2 -ml-1 rounded-xl hover:bg-neutral-800 text-neutral-300 shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => setShowInfoSidebar(!showInfoSidebar)}>
                    <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xl shadow-xs shrink-0">
                      {activeGroup.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-neutral-100 tracking-tight truncate">{activeGroup.name}</h3>
                      <p className="text-[11px] text-neutral-400 font-medium">{activeGroup.membersCount} members</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 text-neutral-400 shrink-0">
                  <button onClick={() => triggerToast(`Calling ${activeGroup.name}...`)} className="p-2.5 rounded-xl hover:bg-neutral-800 hover:text-white transition-all cursor-pointer">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button onClick={() => triggerToast(`Video call for ${activeGroup.name}...`)} className="p-2.5 rounded-xl hover:bg-neutral-800 hover:text-white transition-all cursor-pointer">
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      showInfoSidebar ? 'bg-white text-black' : 'hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                <div className="flex justify-center my-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-800/70 border border-neutral-700 text-neutral-300 shadow-xs">
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
                          <div className="max-w-md px-4 py-2 rounded-2xl bg-neutral-800 border border-neutral-700 text-center text-xs text-neutral-300 shadow-xs">
                            {msg.text}
                          </div>
                        </motion.div>
                      );
                    }

                    // Case-sensitive exact match: a message is "mine" only if
                    // its senderName is identical to the current userName —
                    // e.g. "nekhil" and "Nekhil" are treated as different people.
                    const isMe = msg.senderName === userName;

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
                              ? 'bg-white text-black rounded-br-none'
                              : 'bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-bl-none'
                          }`}
                        >
                          {/* Sender name on every message */}
                          {msg.senderName && (
                            <p className={`text-[10px] font-bold mb-1 ${
                              isMe ? 'text-black/60' : 'text-neutral-400'
                            }`}>
                              {msg.senderName}
                            </p>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>

                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-black/50' : 'text-neutral-500'}`}>
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              <span>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-black/70" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-black/40" />
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
              <div className="px-4 py-2 border-t border-neutral-800 bg-neutral-900/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
                {[
                  'Count me in! ⚽',
                  'What time?',
                  'Where should we meet?',
                  'I am joining 🚀'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <footer className="p-3 md:p-4 border-t border-neutral-800 bg-neutral-900/60 backdrop-blur-sm flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSendMessage("👍")}
                  className="p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
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
                    className="flex-1 py-3 px-4 rounded-xl bg-neutral-800/60 border border-neutral-700 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-800 shadow-xs transition-all"
                  />
                  {inputText.trim() ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="p-3 rounded-xl bg-white text-black shadow-md shadow-white/10 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendMessage("🎙️ Voice note")}
                      className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
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
                className="w-20 h-20 rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-4xl mb-4 shadow-sm"
              >
                👋
              </motion.div>
              <h3 className="text-base font-bold text-neutral-200">Hey {userName}! Select or create a lobby</h3>
              <p className="text-xs text-neutral-400 max-w-sm mt-1 leading-relaxed">
                Connect with freshers and seniors for sports, hostels, and hackathons.
              </p>
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold shadow-md shadow-black/40 transition-all cursor-pointer hover:shadow-lg"
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
            <>
              {/* Backdrop — mobile only, tap to dismiss */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInfoSidebar(false)}
                className="fixed inset-0 z-30 bg-black/60 md:hidden"
              />
              <motion.aside
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="fixed inset-y-0 right-0 z-40 w-full sm:w-[340px] md:static md:z-auto md:w-[320px] h-full border-l border-neutral-800 bg-neutral-950 flex flex-col overflow-y-auto shrink-0"
              >
              <div className="h-16 px-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
                <h3 className="text-sm font-bold text-neutral-100">Lobby Info</h3>
                <button onClick={() => setShowInfoSidebar(false)} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-center border-b border-neutral-800">
                <div className="w-20 h-20 rounded-3xl bg-neutral-800 border border-neutral-700 mx-auto flex items-center justify-center text-4xl mb-3 shadow-sm">
                  {activeGroup.avatar}
                </div>
                <h4 className="text-base font-bold text-neutral-100">{activeGroup.name}</h4>
                <p className="text-xs text-neutral-300 font-bold mt-0.5">{activeGroup.categoryLabel}</p>
                {activeGroup.isPrivate && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 text-[10px] font-bold uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Private Lobby
                  </span>
                )}
                {activeGroup.hostelBlock && (
                  <p className="text-[11px] text-neutral-400 mt-1">📍 {activeGroup.hostelBlock}</p>
                )}
              </div>

              <div className="p-5 space-y-5 flex-1">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">About</h5>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-800/60 p-3 rounded-2xl border border-neutral-700">
                    {activeGroup.aboutText}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Campus Location</h5>
                  <div className="p-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-neutral-400" />
                    <span>VIT Vellore Main Campus</span>
                  </div>
                </div>

                {/* Danger Zone — permanent delete, pushed straight to Firestore */}
                <div className="pt-2 border-t border-neutral-800">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-rose-500/80 mb-2">Danger Zone</h5>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-400 text-xs font-semibold hover:bg-rose-950/70 hover:text-rose-300 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete this lobby</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-3">
                      <p className="text-[11px] text-rose-300 leading-relaxed">
                        This permanently deletes <span className="font-bold">"{activeGroup.name}"</span> and every message in it from the database. This can't be undone.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeletingGroup}
                          className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-[11px] font-semibold hover:bg-neutral-700 transition-all cursor-pointer disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => activeGroup.id && handleDeleteGroup(activeGroup.id, activeGroup.name)}
                          disabled={isDeletingGroup}
                          className="flex-1 px-3 py-2 rounded-xl bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-500 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {isDeletingGroup ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                            />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>{isDeletingGroup ? 'Deleting...' : 'Confirm Delete'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW LOBBY */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showNewGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setNewGroupIsPrivate(false);
                  setNewGroupPassword('');
                  setNewGroupPasswordError(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-neutral-800 text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">Create Campus Lobby</h3>
                  <p className="text-xs text-neutral-400">by {userName} • Saved to Firestore</p>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Lobby Title:</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Badminton Doubles at 6 PM"
                    className="w-full rounded-xl bg-neutral-800/60 border border-neutral-700 p-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Category:</label>
                    <select
                      value={newGroupCategory}
                      onChange={(e) => setNewGroupCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-neutral-800/60 border border-neutral-700 p-3 text-xs text-neutral-100 focus:outline-none focus:border-white/30 focus:bg-neutral-800"
                    >
                      <option value="sports">Sports Match ⚽</option>
                      <option value="mentor">Senior Mentorship 🎓</option>
                      <option value="hostel">Hostel Hangout 🏢</option>
                      <option value="hackathon">Hackathon Squad 🚀</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">Location:</label>
                    <input
                      type="text"
                      value={newGroupHostel}
                      onChange={(e) => setNewGroupHostel(e.target.value)}
                      placeholder="e.g. MH-G Block"
                      className="w-full rounded-xl bg-neutral-800/60 border border-neutral-700 p-3 text-xs text-neutral-100 focus:outline-none focus:border-white/30 focus:bg-neutral-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Description:</label>
                  <textarea
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Details about timings, rules, or who can join..."
                    className="w-full rounded-xl bg-neutral-800/60 border border-neutral-700 p-3 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-800"
                  />
                </div>

                {/* Private lobby toggle + password */}
                <div className="rounded-2xl border border-neutral-700 bg-neutral-800/40 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setNewGroupIsPrivate(!newGroupIsPrivate);
                      setNewGroupPasswordError(null);
                    }}
                    className="w-full flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                      {newGroupIsPrivate ? (
                        <Lock className="w-4 h-4 text-white" />
                      ) : (
                        <Unlock className="w-4 h-4 text-neutral-500" />
                      )}
                      Make this lobby private
                    </span>
                    <span
                      className={`relative w-10 h-5 rounded-full transition-all shrink-0 ${
                        newGroupIsPrivate ? 'bg-white' : 'bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all ${
                          newGroupIsPrivate ? 'left-5 bg-black' : 'left-0.5 bg-white'
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence>
                    {newGroupIsPrivate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-neutral-700/60">
                          <label className="text-xs font-semibold text-neutral-300 block mb-1">Lobby Password:</label>
                          <div className="relative">
                            <input
                              type={showNewGroupPassword ? 'text' : 'password'}
                              value={newGroupPassword}
                              onChange={(e) => {
                                setNewGroupPassword(e.target.value);
                                setNewGroupPasswordError(null);
                              }}
                              placeholder="Set a password to lock this lobby"
                              className="w-full rounded-xl bg-neutral-900/60 border border-neutral-700 p-3 pr-10 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-white/30 focus:bg-neutral-900"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewGroupPassword(!showNewGroupPassword)}
                              className="absolute right-3 top-1/2 -tranneutral-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                            >
                              {showNewGroupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed">
                            Anyone who wants into this lobby will need this password. Only members who enter it correctly can view or send messages.
                          </p>
                          {newGroupPasswordError && (
                            <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" /> {newGroupPasswordError}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 mt-6">
                  <button type="button" onClick={() => {
                    setShowNewGroupModal(false);
                    setNewGroupIsPrivate(false);
                    setNewGroupPassword('');
                    setNewGroupPasswordError(null);
                  }} className="px-5 py-2.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-white text-xs font-bold text-black shadow-md shadow-black/40 cursor-pointer hover:shadow-lg">
                    Create Lobby
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════ */}
      {/* MODAL: PRIVATE LOBBY PASSWORD PROMPT */}
      {/* ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {passwordPromptGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => {
                  setPasswordPromptGroup(null);
                  setPasswordAttempt('');
                  setPasswordError(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-black/40 mb-4">
                  <Lock className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-lg font-bold text-neutral-100">{passwordPromptGroup.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">This is a private lobby. Enter the password to view its chats.</p>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      autoFocus
                      type={showPasswordAttempt ? 'text' : 'password'}
                      value={passwordAttempt}
                      onChange={(e) => {
                        setPasswordAttempt(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="Enter lobby password"
                      className={`w-full rounded-xl bg-neutral-800/60 border p-3 pr-10 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:bg-neutral-800 transition-all ${
                        passwordError ? 'border-rose-700 focus:border-rose-500' : 'border-neutral-700 focus:border-white/40'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordAttempt(!showPasswordAttempt)}
                      className="absolute right-3 top-1/2 -tranneutral-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showPasswordAttempt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingPassword || !passwordAttempt.trim()}
                  className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold shadow-md shadow-black/40 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifyingPassword ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                    />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <span>{isVerifyingPassword ? 'Checking...' : 'Unlock Lobby'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
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
      <div className="h-[100dvh] w-screen flex items-center justify-center bg-black">
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