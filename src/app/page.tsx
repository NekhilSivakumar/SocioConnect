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
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Trophy,
  GraduationCap,
  Building,
  Sparkles,
  CheckCheck,
  Check,
  Plus,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Info,
  X,
  Play,
  Pause,
  Filter,
  UserPlus,
  Flame,
  Star,
  Compass,
  Circle,
  ThumbsUp,
  Heart
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'me' | 'them' | 'system';
  senderName?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  matchData?: {
    sport: string;
    location: string;
    time: string;
    joined: number;
    needed: number;
    userJoined?: boolean;
  };
  voiceNote?: {
    duration: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  category: 'sports' | 'mentor' | 'hostel' | 'hackathon' | 'general';
  categoryLabel: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  onlineStatusText: string;
  isGroup: boolean;
  membersCount?: number;
  aboutText: string;
  hostelBlock?: string;
  messages: Message[];
}

export default function WhatsAppSocioConnectPage() {
  const initialChats: Chat[] = [
    {
      id: 'chat-1',
      name: 'VIT Football Turf 5v5 (Gate 2)',
      avatar: '⚽',
      category: 'sports',
      categoryLabel: 'Sports Match',
      lastMessage: 'Match confirmed for 5:45 PM today at Outdoor Turf! Need 2 more defenders.',
      lastMessageTime: '18:32',
      unreadCount: 3,
      isOnline: true,
      onlineStatusText: '12 active members',
      isGroup: true,
      membersCount: 12,
      hostelBlock: 'MH-G & MH-K',
      aboutText: 'Daily evening football turf matches for freshers & seniors. Respect game timings and bring shoes.',
      messages: [
        {
          id: 'm1-1',
          sender: 'them',
          senderName: 'Devansh (1st Year CSE)',
          text: 'Hey guys! Booking the Gate 2 Turf for 5:45 PM today. Who is in for a 5v5 match?',
          timestamp: '17:15',
          status: 'read'
        },
        {
          id: 'm1-2',
          sender: 'them',
          senderName: 'Rohan (1st Year Mech)',
          text: 'Count me in! I will bring the ball ⚽',
          timestamp: '17:20',
          status: 'read'
        },
        {
          id: 'm1-3',
          sender: 'system',
          text: '🏆 Devansh pinned a Sports Match Invite',
          timestamp: '17:22',
          matchData: {
            sport: 'Football 5v5 Friendly',
            location: 'VIT Outdoor Stadium (Turf 2)',
            time: 'Today • 5:45 PM',
            joined: 8,
            needed: 2,
            userJoined: false
          }
        },
        {
          id: 'm1-4',
          sender: 'them',
          senderName: 'Karthik (4th Year Senior)',
          text: 'Good luck freshers! Turf light keys are with the physical education room if you play past 6:30.',
          timestamp: '18:10',
          status: 'read'
        },
        {
          id: 'm1-5',
          sender: 'them',
          senderName: 'Devansh (Host)',
          text: 'Match confirmed for 5:45 PM today at Outdoor Turf! Need 2 more defenders.',
          timestamp: '18:32',
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-2',
      name: 'Aditya Narayanan (4th Yr Senior)',
      avatar: '👨‍💻',
      category: 'mentor',
      categoryLabel: 'Senior Mentor',
      lastMessage: 'For FFCS, make sure you keep slot B1+TB1 free on Tuesdays for library study hours!',
      lastMessageTime: '18:15',
      unreadCount: 1,
      isOnline: true,
      onlineStatusText: 'Online • Ex-Google STEP | 9.88 CGPA',
      isGroup: false,
      hostelBlock: 'MH-N Block',
      aboutText: '4th Year CSE Senior. Can help freshers with FFCS slot planning, teacher ratings, hackathons, and placement roadmaps.',
      messages: [
        {
          id: 'm2-1',
          sender: 'me',
          text: 'Hi Aditya bhaiya! I am a 1st-year fresher in MH-D. Had a quick doubt about which faculty is best for calculus.',
          timestamp: '18:02',
          status: 'read'
        },
        {
          id: 'm2-2',
          sender: 'them',
          text: 'Hey! Welcome to VIT! Glad to connect. For Calculus, look for faculties who give high marks on internal quizzes.',
          timestamp: '18:05',
          status: 'read'
        },
        {
          id: 'm2-3',
          sender: 'them',
          text: 'I sent a voice note detailing the top 3 professor codes from last semester:',
          timestamp: '18:07',
          voiceNote: {
            duration: '0:42'
          },
          status: 'read'
        },
        {
          id: 'm2-4',
          sender: 'them',
          text: 'For FFCS, make sure you keep slot B1+TB1 free on Tuesdays for library study hours!',
          timestamp: '18:15',
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-3',
      name: 'Badminton Doubles - Indoor Complex',
      avatar: '🏸',
      category: 'sports',
      categoryLabel: 'Sports Match',
      lastMessage: 'Court 3 is booked for 7 PM. Bring non-marking shoes!',
      lastMessageTime: '17:50',
      unreadCount: 0,
      isOnline: false,
      onlineStatusText: 'Last seen today at 18:00',
      isGroup: true,
      membersCount: 8,
      hostelBlock: 'MH-L & LH-C',
      aboutText: 'Casual & competitive badminton doubles group. We play 4-5 times a week at the indoor courts near Foodys.',
      messages: [
        {
          id: 'm3-1',
          sender: 'them',
          senderName: 'Tanmay (1st Year)',
          text: 'Anyone free for badminton today at the indoor complex?',
          timestamp: '17:30',
          status: 'read'
        },
        {
          id: 'm3-2',
          sender: 'me',
          text: 'Yes! Count me in. I have two rackets with me.',
          timestamp: '17:35',
          status: 'read'
        },
        {
          id: 'm3-3',
          sender: 'them',
          senderName: 'Tanmay',
          text: 'Court 3 is booked for 7 PM. Bring non-marking shoes!',
          timestamp: '17:50',
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-4',
      name: 'Sneha Krishnan (3rd Yr Mentor)',
      avatar: '👩‍🔬',
      category: 'mentor',
      categoryLabel: 'Senior Mentor',
      lastMessage: 'Let me know if you need the Physics lab record samples or viva sheets!',
      lastMessageTime: '16:40',
      unreadCount: 0,
      isOnline: true,
      onlineStatusText: 'Online • IEEE Branch Lead | 9.74 CGPA',
      isGroup: false,
      hostelBlock: 'LH-E Block',
      aboutText: '3rd Year ECE student. Happy to help freshers balance CGPA with clubs, hackathons, and sports.',
      messages: [
        {
          id: 'm4-1',
          sender: 'them',
          text: 'Hey! Hope college orientation went smoothly!',
          timestamp: '16:20',
          status: 'read'
        },
        {
          id: 'm4-2',
          sender: 'them',
          text: 'Let me know if you need the Physics lab record samples or viva sheets!',
          timestamp: '16:40',
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-5',
      name: 'Gravitas Hackathon Squad 2026',
      avatar: '🚀',
      category: 'hackathon',
      categoryLabel: 'Hackathon Squad',
      lastMessage: 'Looking for 1 frontend dev with Next.js / Tailwind experience for our team.',
      lastMessageTime: '15:20',
      unreadCount: 2,
      isOnline: true,
      onlineStatusText: '18 members • 4 active projects',
      isGroup: true,
      membersCount: 18,
      hostelBlock: 'All Campus',
      aboutText: 'Official collaboration group for freshers & seniors participating in university hackathons.',
      messages: [
        {
          id: 'm5-1',
          sender: 'them',
          senderName: 'Pooja (1st Year IT)',
          text: 'Hey everyone! We are building an AI-powered campus navigation app for Gravitas.',
          timestamp: '15:00',
          status: 'read'
        },
        {
          id: 'm5-2',
          sender: 'them',
          senderName: 'Pooja (1st Year IT)',
          text: 'Looking for 1 frontend dev with Next.js / Tailwind experience for our team.',
          timestamp: '15:20',
          status: 'read'
        }
      ]
    },
    {
      id: 'chat-6',
      name: 'MH-K & MH-L Freshers Hangout',
      avatar: '🏢',
      category: 'hostel',
      categoryLabel: 'Hostel Group',
      lastMessage: 'Night canteen run around 10:30 PM? Who is up for parottas and chai?',
      lastMessageTime: '14:10',
      unreadCount: 0,
      isOnline: true,
      onlineStatusText: '64 hostelers online',
      isGroup: true,
      membersCount: 64,
      hostelBlock: 'MH-K / MH-L Block',
      aboutText: 'Common chat for freshers staying in MH-K and MH-L blocks. Sharing laundry timings, night canteen runs, and gym buddies.',
      messages: [
        {
          id: 'm6-1',
          sender: 'them',
          senderName: 'Aarav (MH-K 302)',
          text: 'Night canteen run around 10:30 PM? Who is up for parottas and chai?',
          timestamp: '14:10',
          status: 'read'
        }
      ]
    }
  ];

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // New Group modal state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<'sports' | 'mentor' | 'hostel' | 'hackathon'>('sports');
  const [newGroupHostel, setNewGroupHostel] = useState('VIT Outdoor Turf');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeChat) return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: 'me',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: newMsg.timestamp,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setChats(updatedChats);
    setInputText('');

    // Simulate realistic instant response from the senior / group members
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      if (activeChat.category === 'sports') {
        replyText = `Awesome! Added you to the lineup. We will meet 10 minutes prior near the court entrance 👍`;
      } else if (activeChat.category === 'mentor') {
        replyText = `Got your message! I will share the exact syllabus breakdown and faculty review sheet on VIT mail too. Feel free to ping anytime!`;
      } else if (activeChat.category === 'hackathon') {
        replyText = `Super! Let's connect on GitHub and brainstorm the system architecture after classes.`;
      } else {
        replyText = `Sounds great! See you guys there near the hostel block.`;
      }

      const botReply: Message = {
        id: String(Date.now() + 1),
        sender: 'them',
        senderName: activeChat.isGroup ? 'Group Admin' : activeChat.name.split(' ')[0],
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setChats(prev =>
        prev.map(c => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: botReply.timestamp,
              messages: [...c.messages, botReply]
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  const handleJoinMatch = (msgId: string) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === activeChat.id) {
          const newMessages = c.messages.map(m => {
            if (m.id === msgId && m.matchData) {
              const alreadyJoined = m.matchData.userJoined;
              return {
                ...m,
                matchData: {
                  ...m.matchData,
                  joined: alreadyJoined ? m.matchData.joined - 1 : m.matchData.joined + 1,
                  needed: alreadyJoined ? m.matchData.needed + 1 : Math.max(0, m.matchData.needed - 1),
                  userJoined: !alreadyJoined
                }
              };
            }
            return m;
          });
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const emojiMap: Record<string, string> = {
      sports: '🏆',
      mentor: '🎓',
      hostel: '🏢',
      hackathon: '⚡'
    };

    const newChatObj: Chat = {
      id: 'chat-' + Date.now(),
      name: newGroupName.trim(),
      avatar: emojiMap[newGroupCategory] || '💬',
      category: newGroupCategory,
      categoryLabel: newGroupCategory === 'sports' ? 'Sports Match' : newGroupCategory === 'mentor' ? 'Senior Mentor' : newGroupCategory === 'hostel' ? 'Hostel Hub' : 'Hackathon Squad',
      lastMessage: `Group created by you: "${newGroupName}"`,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      isOnline: true,
      onlineStatusText: 'Active group',
      isGroup: true,
      membersCount: 1,
      hostelBlock: newGroupHostel,
      aboutText: newGroupDesc || 'New community group for VIT campus connection.',
      messages: [
        {
          id: 'init-' + Date.now(),
          sender: 'system',
          text: `🎉 You created the group "${newGroupName}". Share this lobby with your hostel and sports buddies!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setChats([newChatObj, ...chats]);
    setActiveChatId(newChatObj.id);
    setShowNewChatModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const filteredChats = chats.filter(c => {
    const matchesFilter = filterCategory === 'all' || c.category === filterCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-screen w-screen bg-[#070a14] text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-emerald-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Main WhatsApp-Style Container */}
      <div className="relative z-10 flex-1 flex overflow-hidden border border-white/10 bg-[#090d1a]/95 backdrop-blur-2xl">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: CONVERSATIONS & CHAT LIST */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col border-r border-white/10 bg-[#0a0f21] shrink-0">
          
          {/* User Profile & Top Bar */}
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[2px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d1326] rounded-full flex items-center justify-center text-sm font-bold text-indigo-300">
                    ME
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0f21] rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-tight">SocioConnect</h2>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Fresher • MH-G Block</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowNewChatModal(true)}
                title="Create New Sports / Mentor Lobby"
                className="p-2 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="p-3 border-b border-white/5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats, seniors, sports matches..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* WhatsApp-Style Filter Pills */}
          <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-white/5 bg-black/20">
            {[
              { id: 'all', label: 'All' },
              { id: 'sports', label: '⚽ Sports' },
              { id: 'mentor', label: '🎓 Seniors' },
              { id: 'hostel', label: '🏢 Hostels' },
              { id: 'hackathon', label: '🚀 Hackathons' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No chats found. Try searching something else or create a new lobby!
              </div>
            ) : (
              filteredChats.map(chat => {
                const isActive = chat.id === activeChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      // Clear unread count on select
                      setChats(prev =>
                        prev.map(c => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Chat Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl shadow-md">
                        {chat.avatar}
                      </div>
                      {chat.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0f21] rounded-full"></span>
                      )}
                    </div>

                    {/* Chat Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`text-xs font-bold truncate ${isActive ? 'text-indigo-200' : 'text-white'}`}>
                          {chat.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                          {chat.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-400 truncate pr-2">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="shrink-0 min-w-4 h-4 px-1.5 rounded-full bg-emerald-500 text-[10px] font-bold text-black flex items-center justify-center shadow-sm">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${
                          chat.category === 'sports'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : chat.category === 'mentor'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {chat.categoryLabel}
                        </span>
                        {chat.hostelBlock && (
                          <span className="text-[9px] text-slate-500">
                            • {chat.hostelBlock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Broadcast Bar */}
          <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] text-slate-300">1,450+ VITians connected</span>
            </div>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              + Create Lobby
            </button>
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* CENTER: ACTIVE CHAT CONVERSATION WINDOW */}
        {/* ========================================================================= */}
        <section className="flex-1 flex flex-col h-full bg-[#080c19] relative">
          
          {/* Active Chat Header */}
          <header className="h-16 px-4 md:px-6 border-b border-white/10 bg-[#090e20]/90 backdrop-blur-md flex items-center justify-between shrink-0">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowInfoSidebar(!showInfoSidebar)}>
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-xl">
                  {activeChat.avatar}
                </div>
                {activeChat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#090e20] rounded-full"></span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{activeChat.name}</span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {isTyping ? 'typing...' : activeChat.onlineStatusText}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 text-slate-300">
              <button
                onClick={() => alert(`Calling ${activeChat.name} via VIT Voice Room...`)}
                title="Voice Call"
                className="p-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-slate-300" />
              </button>
              <button
                onClick={() => alert(`Starting Video Meet for ${activeChat.name}...`)}
                title="Video Call"
                className="p-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-slate-300" />
              </button>
              <button
                onClick={() => setShowInfoSidebar(!showInfoSidebar)}
                title="View Group / Mentor Info"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  showInfoSidebar ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-radial from-indigo-950/10 via-transparent to-transparent">
            
            {/* Date Separator */}
            <div className="flex justify-center my-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 shadow-sm">
                Today • VIT Campus Feed
              </span>
            </div>

            {activeChat.messages.map(msg => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="space-y-3">
                    <div className="flex justify-center">
                      <div className="max-w-md px-4 py-2 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center text-xs text-indigo-200">
                        {msg.text}
                      </div>
                    </div>

                    {/* Interactive Match Invitation Widget */}
                    {msg.matchData && (
                      <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 shadow-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-white">{msg.matchData.sport}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Live Match
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                          <p className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{msg.matchData.location}</span>
                          </p>
                          <p className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{msg.matchData.time}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="text-xs">
                            <strong className="text-emerald-400">{msg.matchData.joined} Players</strong>
                            <span className="text-slate-400 ml-1.5">({msg.matchData.needed} needed)</span>
                          </div>

                          <button
                            onClick={() => handleJoinMatch(msg.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              msg.matchData.userJoined
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200'
                            }`}
                          >
                            {msg.matchData.userJoined ? '✓ Joined Match' : '+ Join Match'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isMe = msg.sender === 'me';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md relative ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-[#151c33] border border-white/10 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {/* Sender Name for group chats */}
                    {!isMe && activeChat.isGroup && msg.senderName && (
                      <p className="text-[10px] font-bold text-indigo-400 mb-1">
                        {msg.senderName}
                      </p>
                    )}

                    {/* Regular Message Text */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Voice Note Player Simulator */}
                    {msg.voiceNote && (
                      <div className="mt-2 p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3">
                        <button
                          onClick={() => setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)}
                          className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          {isPlayingAudio === msg.id ? (
                            <Pause className="w-4 h-4 fill-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-black ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1 flex items-center gap-1">
                          <div className="h-4 flex-1 flex items-center gap-0.5">
                            {[12, 24, 16, 32, 20, 28, 14, 30, 22, 16, 26, 18, 10, 24].map((h, i) => (
                              <div
                                key={i}
                                style={{ height: `${isPlayingAudio === msg.id ? Math.max(6, (h * Math.random() + 8)) : h / 2}px` }}
                                className={`w-1 rounded-full transition-all ${
                                  isPlayingAudio === msg.id ? 'bg-emerald-400' : 'bg-slate-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-300 font-mono">
                            {msg.voiceNote.duration}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Timestamp and Delivery Checks */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#151c33] border border-white/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Suggestion Chips */}
          <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              'Count me in for the match! ⚽',
              'Can you share faculty slot recommendations?',
              'What time are you free near Foodys?',
              'Joining the hackathon team 🚀'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Bottom Bar */}
          <footer className="p-3 md:p-4 border-t border-white/10 bg-[#090e20] flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSendMessage("👍")}
              title="Emoji"
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                alert("Attachment menu: Share Sports Match invite, Code snippet, or Hostel meetup pin.");
              }}
              title="Attach File / Match Invite"
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
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
                placeholder={`Message ${activeChat.name}... (Press Enter)`}
                className="flex-1 py-3 px-4 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />

              {inputText.trim() ? (
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendMessage("🎙️ [Voice note message: 0:15]")}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </form>
          </footer>

        </section>

        {/* ========================================================================= */}
        {/* RIGHT DRAWER: CHAT / SENIOR / GROUP INFO */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {showInfoSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full border-l border-white/10 bg-[#0a0f21] flex flex-col overflow-y-auto shrink-0"
            >
              <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Lobby Details</h3>
                <button
                  onClick={() => setShowInfoSidebar(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-center border-b border-white/10">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/10 mx-auto flex items-center justify-center text-4xl mb-3 shadow-xl">
                  {activeChat.avatar}
                </div>
                <h4 className="text-base font-bold text-white">{activeChat.name}</h4>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{activeChat.categoryLabel}</p>
                {activeChat.hostelBlock && (
                  <p className="text-[11px] text-slate-400 mt-1">📍 {activeChat.hostelBlock}</p>
                )}
              </div>

              <div className="p-5 space-y-5 flex-1">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">About & Rules</h5>
                  <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                    {activeChat.aboutText}
                  </p>
                </div>

                {activeChat.isGroup && (
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Group Members ({activeChat.membersCount || 12})
                    </h5>
                    <div className="space-y-2">
                      {[
                        { name: 'You (1st Year)', role: 'Fresher', hostel: 'MH-G' },
                        { name: 'Devansh S.', role: 'Host', hostel: 'MH-G 204' },
                        { name: 'Aditya N.', role: '4th Yr Senior', hostel: 'MH-N' },
                        { name: 'Rohan K.', role: '1st Year', hostel: 'MH-K' }
                      ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                          <span className="font-semibold text-slate-200">{member.name}</span>
                          <span className="text-[10px] text-slate-400">{member.role} • {member.hostel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Campus Location</h5>
                  <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-indigo-400" />
                    <span>VIT Vellore Main Campus (Indoor Complex / Turf 2)</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW SPORTS MATCH / SENIOR CONNECT LOBBY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0d1326] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowNewChatModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <Plus className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Create WhatsApp Campus Lobby</h3>
                  <p className="text-xs text-slate-400">Start a match, hostel hangout, or senior channel</p>
                </div>
              </div>

              <form onSubmit={handleCreateNewChat} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Group / Lobby Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Cricket 6v6 at Main Ground, 3rd Year CSE Q&A"
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Category:
                    </label>
                    <select
                      value={newGroupCategory}
                      onChange={(e) => setNewGroupCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="sports">Sports Match ⚽</option>
                      <option value="mentor">Senior Mentorship 🎓</option>
                      <option value="hostel">Hostel Hangout 🏢</option>
                      <option value="hackathon">Hackathon Squad 🚀</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Location / Hostel:
                    </label>
                    <input
                      type="text"
                      value={newGroupHostel}
                      onChange={(e) => setNewGroupHostel(e.target.value)}
                      placeholder="e.g. MH-G Block, Gate 2 Turf"
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Description / Timings:
                  </label>
                  <textarea
                    rows={3}
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Describe timings, required skills, or hostel blocks invited..."
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewChatModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Create Channel
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


