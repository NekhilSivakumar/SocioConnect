'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Users,
  Trophy,
  Calculator,
  Atom,
  FlaskConical,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  BookOpen,
  Send,
  Zap,
  Award,
  ShieldCheck,
  PlusCircle,
  Clock
} from 'lucide-react';

interface CourseCardData {
  id: string;
  title: string;
  code: string;
  difficulty: 'Hard' | 'Moderate-Hard' | 'Moderate';
  difficultyScore: string;
  badgeColor: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  hoverGlow: string;
  description: string;
  modules: string[];
  seniorAdvice: string;
  notesCount: number;
  pastPapersCount: number;
  mentorName: string;
  mentorYear: string;
}

interface ActivityItem {
  id: string;
  title: string;
  category: 'Sports' | 'Hackathon' | 'Music & Arts' | 'Gaming' | 'Study Group';
  hostName: string;
  hostYear: string;
  location: string;
  time: string;
  playersNeeded: number;
  joinedCount: number;
  tags: string[];
}

interface SeniorMentor {
  id: string;
  name: string;
  year: string;
  branch: string;
  hostel: string;
  expertise: string[];
  bio: string;
  cgpa: string;
  sessionsDone: number;
  rating: number;
  isOnline: boolean;
}

export default function SocioConnectPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sports' | 'mentors'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<CourseCardData | null>(null);
  const [connectModalMentor, setConnectModalMentor] = useState<SeniorMentor | null>(null);
  const [sportsCategoryFilter, setSportsCategoryFilter] = useState<string>('All');
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New Activity form state
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState<'Sports' | 'Hackathon' | 'Music & Arts' | 'Gaming' | 'Study Group'>('Sports');
  const [newActivityLocation, setNewActivityLocation] = useState('VIT Outdoor Stadium Turf');
  const [newActivityTime, setNewActivityTime] = useState('Today 6:00 PM');
  const [newActivityPlayers, setNewActivityPlayers] = useState('2');

  const triggerToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const courses: CourseCardData[] = [
    {
      id: 'calculus',
      title: 'Calculus & Differential Equations',
      code: 'MAT1011 / MAT2001',
      difficulty: 'Hard',
      difficultyScore: '9.2 / 10',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: Calculator,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10',
      borderColor: 'group-hover:border-rose-500/50',
      hoverGlow: 'hover:shadow-[0_0_35px_rgba(244,63,94,0.15)]',
      description: 'Master single & multivariable integration, partial differentiation, vector calculus, and Green’s/Stokes’ theorems essential for 1st-year engineering.',
      modules: ['Multiple Integrals & Jacobian', 'Vector Calculus & Divergence', 'Taylor & Maclaurin Series', 'First & Second Order ODEs'],
      seniorAdvice: 'FAT questions frequently test Stokes Theorem and double integration changes of variables. Practice the last 4 semester CAT-1/CAT-2 papers!',
      notesCount: 28,
      pastPapersCount: 14,
      mentorName: 'Arjun Swaminathan',
      mentorYear: '4th Year CSE • 9.84 CGPA'
    },
    {
      id: 'physics',
      title: 'Engineering Physics & Modern Optics',
      code: 'PHY1701 / PHY1999',
      difficulty: 'Moderate-Hard',
      difficultyScore: '8.4 / 10',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      icon: Atom,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      borderColor: 'group-hover:border-cyan-500/50',
      hoverGlow: 'hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]',
      description: 'Covers wave optics, laser interferometry, Maxwell’s electromagnetic equations, quantum mechanics, and semiconductor physics with laboratory experiments.',
      modules: ['Laser & Fiber Optics', 'Quantum Wave Functions & Uncertainty', 'Electromagnetic Field Theory', 'Solid State & Band Gap Analysis'],
      seniorAdvice: 'Physics lab marks (40% weightage) can easily secure an S-grade if your record book and viva questions on spectrometer are prepared early.',
      notesCount: 32,
      pastPapersCount: 11,
      mentorName: 'Rhea Nambiar',
      mentorYear: '3rd Year ECE • 9.65 CGPA'
    },
    {
      id: 'chemistry',
      title: 'Engineering Chemistry & Materials',
      code: 'CHY1701',
      difficulty: 'Moderate',
      difficultyScore: '7.3 / 10',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: FlaskConical,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      borderColor: 'group-hover:border-emerald-500/50',
      hoverGlow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]',
      description: 'Comprehensive exploration of electrochemical cells, corrosion dynamics, high-performance polymers, phase equilibria, and modern nanomaterial fabrication.',
      modules: ['Polymer Composites & Conducting Resins', 'Corrosion Inhibition & Coatings', 'Phase Rule: Pb-Ag & Bi-Cd Systems', 'Spectroscopic Analysis: UV-Vis & FTIR'],
      seniorAdvice: 'Make 1-page summary reaction sheets for corrosion mechanisms and battery chemistry equations. High-scoring course if formulas are crisp.',
      notesCount: 24,
      pastPapersCount: 9,
      mentorName: 'Karthik V.',
      mentorYear: '4th Year Chem/BioTech • 9.72 CGPA'
    }
  ];

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      title: 'Evening Football 5v5 Turf Match',
      category: 'Sports',
      hostName: 'Devansh (Fresher, MH-G Block)',
      hostYear: '1st Year CSE',
      location: 'VIT Main Outdoor Ground (Gate 2 Turf)',
      time: 'Today • 5:45 PM',
      playersNeeded: 3,
      joinedCount: 7,
      tags: ['Football', 'Friendly', 'Hostel Match']
    },
    {
      id: '2',
      title: 'Badminton Doubles Match - Court 3',
      category: 'Sports',
      hostName: 'Siddharth & Tanmay',
      hostYear: '1st Year Mech',
      location: 'Indoor Sports Complex (Near Foodys)',
      time: 'Today • 7:00 PM',
      playersNeeded: 2,
      joinedCount: 2,
      tags: ['Badminton', 'Beginner to Intermediate']
    },
    {
      id: '3',
      title: 'Gravitas Hackathon Team Formation (AI/Web3)',
      category: 'Hackathon',
      hostName: 'Pooja Roy (Fresher, LH-D Block)',
      hostYear: '1st Year IT',
      location: 'Tech Tower Food Court / Online Meet',
      time: 'Tomorrow • 4:00 PM',
      playersNeeded: 2,
      joinedCount: 2,
      tags: ['Hackathon', 'Next.js', 'PyTorch', 'Gravitas']
    },
    {
      id: '4',
      title: 'Acoustic Guitar & Jam Session in Amphitheatre',
      category: 'Music & Arts',
      hostName: 'Aarav & Music Club Freshers',
      hostYear: '1st Year EEE',
      location: 'Auditorium Open Amphitheatre',
      time: 'Friday • 6:30 PM',
      playersNeeded: 5,
      joinedCount: 6,
      tags: ['Music', 'Jamming', 'Singers & Guitarists']
    },
    {
      id: '5',
      title: 'Valorant / FIFA 24 Night LAN Tournament',
      category: 'Gaming',
      hostName: 'Nikhil (MH-K Block)',
      hostYear: '1st Year CSE-AI',
      location: 'MH-K Block Common Room',
      time: 'Saturday • 9:00 PM',
      playersNeeded: 4,
      joinedCount: 6,
      tags: ['Esports', 'Valorant', 'FIFA']
    },
    {
      id: '6',
      title: 'Calculus CAT-1 Group Practice & Doubt Solving',
      category: 'Study Group',
      hostName: 'Ananya & Rohan',
      hostYear: '1st Year Scope',
      location: 'Central Library 2nd Floor Silent Zone',
      time: 'Tomorrow • 5:00 PM',
      playersNeeded: 4,
      joinedCount: 3,
      tags: ['MAT1011', 'PYQ Solving', 'CAT Prep']
    }
  ]);

  const seniorMentors: SeniorMentor[] = [
    {
      id: 'mentor-1',
      name: 'Aditya Narayanan',
      year: '4th Year • CSE Core',
      branch: 'VIT Vellore (MH-N Block)',
      hostel: 'Ex-Google STEP Intern & ACM Chair',
      expertise: ['FFCS Slot Planning', 'Calculus & Discrete Maths', 'Placement Prep', 'DSA & CP'],
      bio: 'Guided over 180+ freshers in choosing the best faculties in FFCS, getting S-grades in Math, and cracking tier-1 hackathons.',
      cgpa: '9.88',
      sessionsDone: 142,
      rating: 4.98,
      isOnline: true
    },
    {
      id: 'mentor-2',
      name: 'Sneha Krishnan',
      year: '3rd Year • ECE',
      branch: 'VIT Vellore (LH-E Block)',
      hostel: 'IEEE Student Branch Lead',
      expertise: ['Physics & Semiconductor', 'Circuit Theory', 'Hostel Life Hacks', 'Club Recruitment'],
      bio: 'Happy to help freshers balance 9+ CGPA with club activities and sports. Ask me anything about physics labs and faculty reviews.',
      cgpa: '9.74',
      sessionsDone: 98,
      rating: 4.95,
      isOnline: true
    },
    {
      id: 'mentor-3',
      name: 'Vikramaditya Rao',
      year: '4th Year • Mechanical & Robotics',
      branch: 'VIT Vellore (MH-P Block)',
      hostel: 'Team Pravega Captain (SAE)',
      expertise: ['Engineering Chemistry', 'CAD/Solidworks', 'Motorsport Teams', 'VIT Gym & Sports'],
      bio: 'Captain for university sports & formula student team. Here to help freshers navigate college clubs, gym routines, and freshman chemistry.',
      cgpa: '9.42',
      sessionsDone: 85,
      rating: 4.91,
      isOnline: false
    }
  ];

  const handleJoinActivity = (id: string, title: string) => {
    setActivities(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            joinedCount: item.joinedCount + 1,
            playersNeeded: Math.max(0, item.playersNeeded - 1)
          };
        }
        return item;
      })
    );
    triggerToast(`🎉 You joined "${title}"! Activity host has been notified.`);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const newAct: ActivityItem = {
      id: String(Date.now()),
      title: newActivityTitle,
      category: newActivityCategory,
      hostName: 'You (1st Year Fresher)',
      hostYear: 'Freshman 2026',
      location: newActivityLocation,
      time: newActivityTime,
      playersNeeded: parseInt(newActivityPlayers) || 2,
      joinedCount: 1,
      tags: ['Campus Activity', newActivityCategory]
    };

    setActivities([newAct, ...activities]);
    setShowCreateActivityModal(false);
    setNewActivityTitle('');
    triggerToast(`🚀 Your campus activity "${newActivityTitle}" is live for all freshers!`);
  };

  const filteredActivities = sportsCategoryFilter === 'All'
    ? activities
    : activities.filter(a => a.category === sportsCategoryFilter);

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-indigo-950/90 border border-indigo-500/40 text-indigo-100 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-sm font-medium">{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/15 blur-[130px] rounded-full" />
        <div className="absolute top-[800px] -left-40 w-[600px] h-[500px] bg-cyan-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[1400px] -right-40 w-[600px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060813]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & VIT Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25 p-[2px]">
              <div className="w-full h-full bg-[#090d1c] rounded-[14px] flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Socio<span className="text-indigo-400">Connect</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  VIT Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Fresher-Senior Network & Academic Vault</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <button
              onClick={() => { setActiveTab('catalog'); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              📚 Course Catalog
            </button>
            <button
              onClick={() => { setActiveTab('sports'); document.getElementById('sports-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'sports'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              ⚽ Sports & Activity Match
            </button>
            <button
              onClick={() => { setActiveTab('mentors'); document.getElementById('mentors-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'mentors'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🎓 Senior Mentors
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateActivityModal(true)}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Activity</span>
            </button>
            <button
              onClick={() => {
                setConnectModalMentor(seniorMentors[0]);
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect Now</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow z-10">

        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Glowing Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 shadow-inner"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>VIT Campus Connect 2026 • 1,450+ Freshers & Seniors Online</span>
          </motion.div>

          {/* Bold Gradient Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]"
          >
            Connect with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Seniors</span>, Team up with <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Freshers</span>, Ace Your VIT Journey.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            The dedicated interactive campus hub for VITians. Get 1-on-1 senior mentorship for FFCS & exams, find instant turf buddies for football & badminton, and explore curated course notes for high GPA.
          </motion.p>

          {/* Interactive CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Explore Course Vault</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                document.getElementById('sports-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-slate-200 hover:text-white hover:bg-white/10 font-semibold text-sm sm:text-base backdrop-blur-xl transition-all cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Find Sports & Activity Buddies</span>
            </motion.button>
          </motion.div>

          {/* Campus Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
          >
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">18+ Blocks</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">MH-A to MH-Q & LH</p>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">450+ Seniors</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Verified 9+ CGPA Mentors</p>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">95+ Matches</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Daily Sports & Jam Sessions</p>
            </div>
            <div className="p-3 text-center border-l border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">100% Free</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">By Students, For Students</p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: 3-COLUMN COURSE CATALOG GRID */}
        <section id="catalog-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curated Academic Vault</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Core Freshman Course Catalog
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Difficulty ratings, comprehensive module breakdowns, past CAT/FAT question banks, and insider tips from top-scoring senior rankers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                💡 Updated for 2026 Curriculum
              </span>
            </div>
          </div>

          {/* 3-COLUMN GRID WITH MOTION SPRING ENTRANCE & HOVER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: idx * 0.15
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                  }}
                  className={`group relative rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-7 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${course.borderColor} ${course.hoverGlow}`}
                >
                  
                  {/* Top Card Section: Icon, Code & Difficulty Badge */}
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-4 rounded-2xl ${course.iconBg} border border-white/10 shadow-lg`}>
                        <Icon className={`w-8 h-8 ${course.iconColor}`} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${course.badgeColor}`}>
                          {course.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">
                          Rating: {course.difficultyScore}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
                      {course.code}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed mb-6">
                      {course.description}
                    </p>

                    {/* Key Modules Covered */}
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Key High-Weightage Modules:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.modules.map((mod, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-lg"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Senior Advice Block */}
                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 mb-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-indigo-200">Senior Ranker Tip:</span>
                      </div>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{course.seniorAdvice}"
                      </p>
                      <p className="text-[10px] text-indigo-400 font-semibold mt-2">
                        — {course.mentorName} ({course.mentorYear})
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>📄 {course.notesCount} Lecture Notes</span>
                      <span>📝 {course.pastPapersCount} PYQ Sets</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Syllabus & Notes</span>
                      </button>
                      <button
                        onClick={() => {
                          triggerToast(`📥 Downloading complete ${course.title} study bundle & formulas...`);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Get PYQ Pack</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </section>

        {/* SECTION 2: SPORTS & ACTIVITY FRESHER MATCHMAKER */}
        <section id="sports-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <Trophy className="w-3.5 h-3.5" />
                <span>Campus Activity & Sports Matchmaker</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Connect with Fellow Freshers
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Need extra players for football, a badminton partner at the indoor complex, or team members for hackathons? Join a lobby or start your own!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateActivityModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host an Activity</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
            {['All', 'Sports', 'Hackathon', 'Music & Arts', 'Gaming', 'Study Group'].map(cat => (
              <button
                key={cat}
                onClick={() => setSportsCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  sportsCategoryFilter === cat
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Activity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {act.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {act.time}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{act.title}</h4>
                  
                  <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                    <p className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{act.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Hosted by: <strong className="text-slate-200">{act.hostName}</strong></span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {act.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-emerald-400">{act.joinedCount} Joined</span>
                    {act.playersNeeded > 0 ? (
                      <span className="text-slate-400 ml-1.5">({act.playersNeeded} slots left)</span>
                    ) : (
                      <span className="text-amber-400 ml-1.5">(Full)</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleJoinActivity(act.id, act.title)}
                    disabled={act.playersNeeded === 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      act.playersNeeded > 0
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20 active:scale-95'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {act.playersNeeded > 0 ? 'Join Activity' : 'Lobby Full'}
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </section>

        {/* SECTION 3: SENIOR MENTORS NETWORK SPOTLIGHT */}
        <section id="mentors-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Senior Guidance & FFCS Strategy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Connect 1-on-1 with Senior Rankers
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Get real advice on teacher selection during FFCS, hostel block choices, research labs, coding clubs, and semester exam strategies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {seniorMentors.map((mentor, idx) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-7 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 backdrop-blur-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-lg shadow-purple-500/20">
                      <div className="w-full h-full bg-[#0d1224] rounded-[14px] flex items-center justify-center text-lg font-bold text-purple-300">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{mentor.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">{mentor.sessionsDone} sessions conducted</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold text-white">{mentor.name}</h4>
                    {mentor.isOnline && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="Available Online" />
                    )}
                  </div>
                  <p className="text-xs text-purple-400 font-semibold mt-0.5">{mentor.year}</p>
                  <p className="text-[11px] text-slate-400 font-medium mb-3">{mentor.hostel}</p>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    "{mentor.bio}"
                  </p>

                  {/* Expertise Badges */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Can help with:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.expertise.map((exp, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Academic Record</span>
                    <span className="text-sm font-bold text-white">{mentor.cgpa} CGPA</span>
                  </div>
                  <button
                    onClick={() => setConnectModalMentor(mentor)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Connect & Chat</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </section>

        {/* SECTION 4: INTERACTIVE FRESHER FAQ & VIT ESSENTIALS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-cyan-950/40 border border-white/10 backdrop-blur-2xl relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Freshers Quick Survival Guide
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
                New to VIT? We've Got Your Back.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                From finding laundry timings in Men's/Ladies' Hostel to getting night canteen access and understanding relative grading cutoffs, SocioConnect bridges you directly with experienced seniors.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>FFCS Black Book</span>
                  </div>
                  <p className="text-xs text-slate-400">Crowdsourced faculty reviews, grading friendliness, and attendance policies.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Campus Sports Access</span>
                  </div>
                  <p className="text-xs text-slate-400">Slot booking timings for Swimming pool, Gym, Squash & Badminton courts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#04060e] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SocioConnect VIT</span>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right space-y-1">
            <p>© 2026 SocioConnect. Built with Next.js, Tailwind CSS & Motion for VIT Students.</p>
            <p className="text-slate-500">Not officially affiliated with VIT administration. Community maintained by VIT Seniors & Freshers.</p>
          </div>
        </div>
      </footer>

      {/* MODAL 1: COURSE DETAILS & SYLLABUS VIEWER */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0b1021] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${selectedCourse.iconBg}`}>
                  <selectedCourse.icon className={`w-6 h-6 ${selectedCourse.iconColor}`} />
                </div>
                <div>
                  <span className="text-xs text-indigo-400 font-bold uppercase">{selectedCourse.code}</span>
                  <h3 className="text-2xl font-bold text-white">{selectedCourse.title}</h3>
                </div>
              </div>

              <div className="space-y-4 my-6 text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Complete Syllabus & High Yield Weightage:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {selectedCourse.modules.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                  <h4 className="font-bold text-indigo-300 text-sm mb-1">Senior Strategy & Exam Hack:</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedCourse.seniorAdvice}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    triggerToast(`📁 Downloaded full syllabus, formula sheets & CAT papers for ${selectedCourse.title}!`);
                    setSelectedCourse(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Download Study Vault</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CONNECT WITH SENIOR */}
      <AnimatePresence>
        {connectModalMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0b1021] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setConnectModalMentor(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/30">
                  {connectModalMentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-2xl font-bold text-white">{connectModalMentor.name}</h3>
                <p className="text-xs text-purple-400 font-semibold">{connectModalMentor.year}</p>
                <p className="text-xs text-slate-400">{connectModalMentor.branch}</p>
              </div>

              <div className="space-y-3 mb-6">
                <label className="text-xs font-semibold text-slate-300 block">
                  What would you like advice on?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['FFCS Faculty Review', 'Calculus/Physics Doubts', 'Hostel Life & Food', 'Placement Roadmap'].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => triggerToast(`Selected: ${topic}`)}
                      className="p-2.5 text-[11px] rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                    >
                      ✓ {topic}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Your Question / Message:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Hi! I am a 1st year fresher looking for help regarding CAT-1 preparation..."
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setConnectModalMentor(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerToast(`✨ Request sent to ${connectModalMentor.name}! You will receive a connect link on VIT mail/WhatsApp.`);
                    setConnectModalMentor(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Connect Request</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATE / HOST CAMPUS ACTIVITY */}
      <AnimatePresence>
        {showCreateActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0b1021] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCreateActivityModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Host a Campus Activity</h3>
                  <p className="text-xs text-slate-400">Match with freshers across VIT Vellore & Chennai</p>
                </div>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Activity Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    placeholder="e.g. Cricket 6-a-side match, Library Study Group, FIFA 24"
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Category:
                    </label>
                    <select
                      value={newActivityCategory}
                      onChange={(e) => setNewActivityCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Sports">Sports</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Music & Arts">Music & Arts</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Study Group">Study Group</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Players Needed:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newActivityPlayers}
                      onChange={(e) => setNewActivityPlayers(e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Location in VIT:
                    </label>
                    <input
                      type="text"
                      value={newActivityLocation}
                      onChange={(e) => setNewActivityLocation(e.target.value)}
                      placeholder="e.g. Indoor Stadium, Outdoor Turf, Library"
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Time / Day:
                    </label>
                    <input
                      type="text"
                      value={newActivityTime}
                      onChange={(e) => setNewActivityTime(e.target.value)}
                      placeholder="e.g. Today 6:00 PM"
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateActivityModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    Publish to VIT Feed
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

