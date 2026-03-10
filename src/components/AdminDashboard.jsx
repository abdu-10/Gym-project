import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import TrainerDetailModal from './TrainerDetailModal';
import UserDetailModal from './UserDetailModal';
import AdminOnboardingModal from './AdminOnboardingModal';

function AdminDashboard({ user, onLogout, onOpenScanner }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [earnings, setEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(true);
  const [disputesError, setDisputesError] = useState(null);
  const [disputeDetailModal, setDisputeDetailModal] = useState({ isOpen: false, dispute: null });
  const [disputeContextLoading, setDisputeContextLoading] = useState(false);
  const [selectedDisputeContext, setSelectedDisputeContext] = useState({ user: null, trainer: null });
  const [decisionModal, setDecisionModal] = useState({ isOpen: false, action: null, dispute: null, loading: false });
  const [adminNotice, setAdminNotice] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [showStaleAttendance, setShowStaleAttendance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(true);
  const [allTrainers, setAllTrainers] = useState([]);
  const [allTrainersLoading, setAllTrainersLoading] = useState(true);
  const [todaySessions, setTodaySessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [allSessions, setAllSessions] = useState([]);
  const [allSessionsLoading, setAllSessionsLoading] = useState(true);
  const [classOpsTab, setClassOpsTab] = useState('today');
  const [addWalkinLoading, setAddWalkinLoading] = useState(false);
  const [sessionDetailsModal, setSessionDetailsModal] = useState({ isOpen: false, session: null, members: [], loading: false });
  const [attendeeFilter, setAttendeeFilter] = useState('all');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/admin_stats', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setTimeout(() => setLoading(false), 600);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setEarningsLoading(true);
    setEarningsError(null);

    fetch('http://localhost:3000/admin/trainer_earnings', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch earnings');
        return res.json();
      })
      .then(data => {
        setEarnings(data);
        setEarningsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching earnings:', err);
        setEarningsError(err.message || 'Failed to load earnings');
        setEarningsLoading(false);
      });
  }, []);

  // Fetch disputes
  useEffect(() => {
    const fetchDisputes = (showLoader = true) => {
      if (showLoader) setDisputesLoading(true);

      fetch('http://localhost:3000/trainer_bookings/disputes_list', { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch disputes');
          return res.json();
        })
        .then(data => {
          setDisputes(data.disputes || []);
          setDisputesError(null);
          setDisputesLoading(false);
        })
        .catch(err => {
          console.error('Error fetching disputes:', err);
          setDisputesError(err.message || 'Failed to load disputes');
          setDisputesLoading(false);
        });
    };

    fetchDisputes(true);
    const interval = setInterval(() => fetchDisputes(false), 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current gym attendance
  useEffect(() => {
    const fetchAttendance = () => {
      fetch('http://localhost:3000/admin/current_attendance', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setCurrentAttendance(data.current_members || []);
          setAttendanceLoading(false);
        })
        .catch(err => {
          console.error('Error fetching current attendance:', err);
          setAttendanceLoading(false);
        });
    };

    fetchAttendance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent transactions
  useEffect(() => {
    setTransactionsLoading(true);
    fetch('http://localhost:3000/admin/recent_transactions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTransactions(data.transactions || []);
        setTransactionsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching transactions:', err);
        setTransactions([]);
        setTransactionsLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/admin/users', { credentials: 'include' }).then(res => res.json()),
      fetch('http://localhost:3000/admin/trainers', { credentials: 'include' }).then(res => res.json())
    ])
      .then(([usersData, trainersData]) => {
        setAllUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        setAllTrainers(Array.isArray(trainersData) ? trainersData : trainersData.trainers || []);
      })
      .catch(err => {
        console.error('Error loading users/trainers:', err);
        setAllUsers([]);
        setAllTrainers([]);
      })
      .finally(() => {
        setAllUsersLoading(false);
        setAllTrainersLoading(false);
      });
  }, []);

  // Fetch today's class sessions for check-in
  useEffect(() => {
    setSessionsLoading(true);
    fetch('http://localhost:3000/admin/classes/today', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const sessions = Array.isArray(data) ? data : data.sessions || [];
        setTodaySessions(sessions.sort((a, b) => {
          const timeA = a.formatted_time || '';
          const timeB = b.formatted_time || '';
          return timeA.localeCompare(timeB);
        }));
      })
      .catch(err => {
        console.error('Error fetching sessions:', err);
        setTodaySessions([]);
      })
      .finally(() => setSessionsLoading(false));
  }, []);

  // Fetch all class sessions for booking management tab
  useEffect(() => {
    setAllSessionsLoading(true);
    const fetchAllSessions = async () => {
      const endpoints = [
        'http://localhost:3000/admin/classes?include_members=true',
        'http://localhost:3000/classes?include_members=true'
      ];

      for (const url of endpoints) {
        const res = await fetch(url, { credentials: 'include' });
        if (res.ok) return res.json();
      }

      throw new Error('Failed to fetch all class sessions');
    };

    fetchAllSessions()
      .then(data => {
        const classes = Array.isArray(data) ? data : data.classes || data.data || [];
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const flattenedSessions = classes.flatMap((cls) => {
          const sessions = Array.isArray(cls?.sessions) ? cls.sessions : [];
          return sessions.map((session) => ({
            ...session,
            class_name: session.class_name || cls.name || 'Class',
            instructor: session.instructor || cls.instructor || 'Trainer'
          }));
        });

        const upcomingOnly = flattenedSessions
          .filter((session) => {
            if (!session?.scheduled_date) return true;
            return new Date(session.scheduled_date) >= startOfToday;
          })
          .sort((a, b) => {
            if (a?.scheduled_date && b?.scheduled_date) {
              return new Date(a.scheduled_date) - new Date(b.scheduled_date);
            }
            return (a?.formatted_time || '').localeCompare(b?.formatted_time || '');
          });

        setAllSessions(upcomingOnly);
      })
      .catch((err) => {
        console.error('Error fetching all class sessions:', err);
        setAllSessions([]);
      })
      .finally(() => setAllSessionsLoading(false));
  }, []);

  const handleAddWalkin = async (sessionId) => {
    setAddWalkinLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/class_sessions/${sessionId}/add_walkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        let errorMessage = 'Failed to add walk-in';
        try {
          const errorData = await res.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch {
          // keep default
        }
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      const updatedSession = data?.session || data?.class_session || data;
      const nextBookedCount = Number(updatedSession?.booked_count);
      const nextSpotsRemaining = Number(updatedSession?.spots_remaining);
      const nextIsFull = typeof updatedSession?.is_full === 'boolean' ? updatedSession.is_full : undefined;
      const nextMembers = Array.isArray(updatedSession?.booked_members)
        ? updatedSession.booked_members
        : (Array.isArray(data?.booked_members) ? data.booked_members : null);
      
      // Update the session with new booking count
      setTodaySessions(prev => prev.map(sess => 
        sess.id === sessionId 
          ? {
              ...sess,
              booked_count: Number.isFinite(nextBookedCount) ? nextBookedCount : (Number(sess.booked_count || 0) + 1),
              spots_remaining: Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(sess.spots_remaining || 0) - 1),
              is_full: typeof nextIsFull === 'boolean'
                ? nextIsFull
                : ((Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(sess.spots_remaining || 0) - 1)) <= 0),
              booked_members: nextMembers || sess.booked_members
            }
          : sess
      ));

      setAllSessions(prev => prev.map(sess =>
        sess.id === sessionId
          ? {
              ...sess,
              booked_count: Number.isFinite(nextBookedCount) ? nextBookedCount : (Number(sess.booked_count || 0) + 1),
              spots_remaining: Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(sess.spots_remaining || 0) - 1),
              is_full: typeof nextIsFull === 'boolean'
                ? nextIsFull
                : ((Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(sess.spots_remaining || 0) - 1)) <= 0),
              booked_members: nextMembers || sess.booked_members
            }
          : sess
      ));

      setSessionDetailsModal(prev => {
        if (!prev.isOpen || prev.session?.id !== sessionId) return prev;

        const mergedSession = {
          ...prev.session,
          booked_count: Number.isFinite(nextBookedCount) ? nextBookedCount : (Number(prev.session?.booked_count || 0) + 1),
          spots_remaining: Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(prev.session?.spots_remaining || 0) - 1),
          is_full: typeof nextIsFull === 'boolean'
            ? nextIsFull
            : ((Number.isFinite(nextSpotsRemaining) ? nextSpotsRemaining : Math.max(0, Number(prev.session?.spots_remaining || 0) - 1)) <= 0),
          booked_members: nextMembers || prev.session?.booked_members
        };

        return {
          ...prev,
          session: mergedSession,
          members: nextMembers || prev.members
        };
      });

      setAdminNotice({
        type: 'success',
        message: data?.message || 'Walk-in added successfully!'
      });
    } catch (err) {
      console.error('Error adding walk-in:', err);
      setAdminNotice({
        type: 'error',
        message: err.message || 'Failed to add walk-in'
      });
    } finally {
      setAddWalkinLoading(false);
    }
  };

  const openSessionDetails = async (session) => {
    const embeddedMembers = Array.isArray(session?.booked_members) ? session.booked_members : [];
    setAttendeeFilter('all');
    setSessionDetailsModal({ isOpen: true, session, members: embeddedMembers, loading: true });

    try {
      const res = await fetch(`http://localhost:3000/admin/class_sessions/${session.id}/booked_members`, {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to load attendees');

      const data = await res.json();
      const fetchedMembers = Array.isArray(data)
        ? data
        : data?.booked_members || data?.members || data?.bookings || data?.data || [];

      setSessionDetailsModal(prev => {
        if (!prev.isOpen || prev.session?.id !== session.id) return prev;
        return {
          ...prev,
          members: Array.isArray(fetchedMembers) ? fetchedMembers : embeddedMembers,
          loading: false
        };
      });
    } catch (err) {
      console.error('Error loading session attendees:', err);
      setSessionDetailsModal(prev => {
        if (!prev.isOpen || prev.session?.id !== session.id) return prev;
        return { ...prev, loading: false };
      });
    }
  };

  const closeSessionDetails = () => {
    setAttendeeFilter('all');
    setSessionDetailsModal({ isOpen: false, session: null, members: [], loading: false });
  };

  const handleOnboardingCreated = (createdRole, createdPayload) => {
    const created = createdPayload?.user || createdPayload?.trainer || createdPayload?.admin || createdPayload?.data || createdPayload;

    if (createdRole === 'member' && created) {
      setAllUsers(prev => [created, ...prev]);
    }

    if (createdRole === 'trainer' && created) {
      setAllTrainers(prev => [created, ...prev]);
    }

    setAdminNotice({
      type: 'success',
      message: `${createdRole.charAt(0).toUpperCase() + createdRole.slice(1)} account created successfully.`
    });
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
  };

  const openDisputeDetails = async (dispute) => {
    setDisputeDetailModal({ isOpen: true, dispute });
    setSelectedDisputeContext({ user: null, trainer: null });

    const fetchUser = async (id) => {
      if (!id) return null;
      const res = await fetch(`http://localhost:3000/admin_api/users/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed loading user ${id}`);
      const data = await res.json();
      return data.user || data;
    };

    if (!dispute?.user_id && !dispute?.trainer_id) return;

    setDisputeContextLoading(true);
    const [userResult, trainerResult] = await Promise.allSettled([
      fetchUser(dispute.user_id),
      fetchUser(dispute.trainer_id)
    ]);

    setSelectedDisputeContext({
      user: userResult.status === 'fulfilled' ? userResult.value : null,
      trainer: trainerResult.status === 'fulfilled' ? trainerResult.value : null
    });
    setDisputeContextLoading(false);
  };

  const closeDisputeDetails = () => {
    setDisputeDetailModal({ isOpen: false, dispute: null });
    setDisputeContextLoading(false);
    setSelectedDisputeContext({ user: null, trainer: null });
  };



  const normalizePhone = (phone) => (phone || '').replace(/[^\d+]/g, '');
  const whatsappNumber = (phone) => (phone || '').replace(/\D/g, '');

  useEffect(() => {
    if (!adminNotice) return;
    const t = setTimeout(() => setAdminNotice(null), 4000);
    return () => clearTimeout(t);
  }, [adminNotice]);

  const openDecisionModal = (action, dispute) => {
    setDecisionModal({ isOpen: true, action, dispute, loading: false });
  };

  const closeDecisionModal = () => {
    if (decisionModal.loading) return;
    setDecisionModal({ isOpen: false, action: null, dispute: null, loading: false });
  };

  const handleDisputeDecision = async () => {
    const action = decisionModal.action;
    const bookingId = decisionModal.dispute?.id;
    if (!action || !bookingId) return;

    const endpoint = action === 'approve' ? 'approve_dispute' : 'reject_dispute';
    setDecisionModal(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`http://localhost:3000/trainer_bookings/${bookingId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) throw new Error(`Failed to ${action} dispute`);

      setDisputes(prev => prev.filter(d => d.id !== bookingId));
      setDecisionModal({ isOpen: false, action: null, dispute: null, loading: false });
      setAdminNotice({
        type: 'success',
        message: action === 'approve'
          ? `Dispute approved for Booking #${bookingId}. Session credit is restored to the member.`
          : `Dispute rejected for Booking #${bookingId}. Session remains deducted.`
      });
    } catch (err) {
      console.error(`Error trying to ${action} dispute:`, err);
      setDecisionModal(prev => ({ ...prev, loading: false }));
      setAdminNotice({
        type: 'error',
        message: err.message || 'Action failed. Please try again.'
      });
    }
  };

  const filteredSignups = stats?.recent_signups?.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-zinc-500 font-mono text-xs tracking-[0.2em]">ESTABLISHING SECURE LINK...</span>
        </div>
      </div>
    );
  }

  // --- ERROR SCREEN ---
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-2xl text-center backdrop-blur-xl">
          <h3 className="text-red-500 font-mono mb-2">CONNECTION_REFUSED</h3>
          <p className="text-zinc-500 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors">RECONNECT</button>
        </div>
      </div>
    );
  }

  // Animation Variants
  const container = { show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const _MOTION = motion;

  const STALE_ATTENDANCE_MINUTES = 6 * 60;
  const parseDurationToMinutes = (durationText) => {
    if (!durationText || typeof durationText !== 'string') return null;
    const text = durationText.toLowerCase();
    const hoursMatch = text.match(/(\d+)\s*h/);
    const minsMatch = text.match(/(\d+)\s*m/);
    const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
    const mins = minsMatch ? Number(minsMatch[1]) : 0;
    if (!hours && !mins) return null;
    return (hours * 60) + mins;
  };

  const activeAttendance = currentAttendance.filter((member) => {
    const minutes = parseDurationToMinutes(member?.duration);
    if (minutes === null) return true;
    return minutes <= STALE_ATTENDANCE_MINUTES;
  });

  const staleAttendance = currentAttendance.filter((member) => {
    const minutes = parseDurationToMinutes(member?.duration);
    return minutes !== null && minutes > STALE_ATTENDANCE_MINUTES;
  });

  const usersDirectory = allUsers;
  const trainersDirectory = allTrainers;

  const toImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== 'string') return null;
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('blob:') ||
      path.startsWith('data:')
    ) return path;
    return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const totalAttendees = sessionDetailsModal.members.length;
  const walkinAttendees = sessionDetailsModal.members.filter(member => Boolean(member?.is_walkin)).length;
  const memberAttendees = totalAttendees - walkinAttendees;
  const filteredSessionMembers = sessionDetailsModal.members.filter((member) => {
    if (attendeeFilter === 'walkins') return member?.is_walkin === true;
    if (attendeeFilter === 'members') return member?.is_walkin !== true;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-red-500/30 overflow-hidden relative">
      
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* --- ELITE NAVBAR --- */}
      <nav className="fixed top-6 left-6 right-6 z-50">
        <div className="max-w-[1800px] mx-auto bg-zinc-900/70 backdrop-blur-xl border border-white/5 rounded-2xl px-6 h-16 flex items-center justify-between shadow-2xl shadow-black/50">
          
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
                <span className="font-black text-white text-sm">F</span>
              </div>
              <span className="text-sm font-bold tracking-wide text-white">FIT<span className="text-red-500">ELITE</span></span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span className="text-zinc-300">Dashboard</span>
              <span>/</span>
              <span>Overview</span>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Global Status */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-500 tracking-wide">SYSTEM ONLINE</span>
            </div>

            <div className="h-4 w-px bg-white/10 hidden lg:block"></div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-zinc-500 leading-none mt-1">Super Admin</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button onClick={onLogout} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>

            {/* Primary Action */}
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="bg-red-600/90 text-white hover:bg-red-500 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-red-500/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>ADD ACCOUNT</span>
            </button>

            <button 
              onClick={onOpenScanner}
              className="ml-2 bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              <span>SCANNER</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- DASHBOARD CONTENT --- */}
      <main className="max-w-[1800px] mx-auto px-6 pt-28 pb-12 relative z-10">

        {adminNotice && (
          <div className="fixed top-24 right-6 z-[70] animate-[fadeIn_0.2s_ease-out]">
            <div className={`rounded-xl px-4 py-3 border text-xs font-semibold shadow-2xl backdrop-blur-sm ${adminNotice.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-red-500/15 border-red-500/40 text-red-200'}`}>
              {adminNotice.message}
            </div>
          </div>
        )}
        
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-12 gap-6">
          
          {/* === LEFT COLUMN (MAIN STATS) - Span 9 === */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* ROW 1: KEY METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Members */}
              <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-sm group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Members</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <div className="text-3xl font-medium text-white tracking-tight">{stats?.total_members}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Lifetime registrations</div>
              </div>

              {/* Active Members */}
              <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-sm group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="text-3xl font-medium text-white tracking-tight">{stats?.active_members}</div>
                <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                  <span className="text-emerald-500">{Math.round((stats?.active_members / stats?.total_members * 100) || 0)}%</span> retention rate
                </div>
              </motion.div>

              {/* Expired Members */}
              <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-sm group hover:border-red-500/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Expired</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                <div className="text-3xl font-medium text-white tracking-tight">{stats?.expired_members}</div>
                <div className="text-[10px] text-red-400 mt-1">Inactive accounts</div>
              </motion.div>

              {/* Monthly Revenue */}
              <motion.div variants={item} className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-white/10 p-5 rounded-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">MRR Revenue</span>
                  <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </div>
                <div className="text-3xl font-medium text-white tracking-tight">${stats?.monthly_revenue?.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-400 mt-1">Est. monthly recurring</div>
              </motion.div>
            </div>

            {/* ROW 1.5: REVENUE SPLIT */}
            <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Revenue Split Overview</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Trainer 60% · Gym 40%</p>
                </div>
                {earningsError && (
                  <span className="text-[10px] text-red-400 font-bold">{earningsError}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const totals = earnings?.earnings || earnings?.totals || earnings?.summary || {};
                  return (
                    <>
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gross Revenue</p>
                        <p className="text-2xl font-semibold text-white mt-2">
                          {earningsLoading ? '...' : formatCurrency(totals.gross_revenue)}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">All package sales</p>
                      </div>
                      <div className="bg-black/40 border border-emerald-500/10 rounded-2xl p-4">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Trainer Earnings</p>
                        <p className="text-2xl font-semibold text-emerald-300 mt-2">
                          {earningsLoading ? '...' : formatCurrency(totals.trainer_earnings)}
                        </p>
                        <p className="text-[10px] text-emerald-500/60 mt-1">Payable amount</p>
                      </div>
                      <div className="bg-black/40 border border-rose-500/10 rounded-2xl p-4">
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Gym Earnings</p>
                        <p className="text-2xl font-semibold text-rose-300 mt-2">
                          {earningsLoading ? '...' : formatCurrency(totals.gym_earnings)}
                        </p>
                        <p className="text-[10px] text-rose-500/60 mt-1">Platform share</p>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Packages Sold</p>
                        <p className="text-2xl font-semibold text-white mt-2">
                          {earningsLoading ? '...' : (totals.package_count ?? 0)}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">Total packages</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 pl-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Trainer</th>
                      <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Packages</th>
                      <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Gross</th>
                      <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Trainer 60%</th>
                      <th className="text-right py-3 pr-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Gym 40%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      // Try multiple possible response structures
                      const breakdown = earnings?.trainers 
                        || earnings?.trainer_breakdown 
                        || earnings?.breakdown 
                        || (Array.isArray(earnings) ? earnings : []);

                      if (earningsLoading) {
                        return (
                          <tr><td colSpan="5" className="py-6 text-center text-xs text-zinc-500">Loading earnings...</td></tr>
                        );
                      }

                      if (!breakdown || breakdown.length === 0) {
                        return (
                          <tr><td colSpan="5" className="py-6 text-center text-xs text-zinc-600">No trainer earnings data yet</td></tr>
                        );
                      }

                      return breakdown.map((trainer, idx) => (
                        <tr key={trainer.trainer_id || trainer.id || idx} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedTrainer(trainer)}>
                          <td className="py-3 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 border border-white/5">
                                {(trainer.trainer_name || trainer.name || 'T').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-200">{trainer.trainer_name || trainer.name || 'Trainer'}</p>
                                <p className="text-[10px] text-zinc-600">ID: {trainer.trainer_id || trainer.id || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-xs text-zinc-400">{trainer.package_count ?? trainer.packages_sold ?? 0}</td>
                          <td className="py-3 text-xs text-zinc-400">{formatCurrency(trainer.gross_revenue)}</td>
                          <td className="py-3 text-xs text-emerald-300">{formatCurrency(trainer.trainer_earnings)}</td>
                          <td className="py-3 pr-2 text-right text-xs text-rose-300">{formatCurrency(trainer.gym_earnings)}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* ROW 2: GROWTH CHART & PLANS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart (2/3) */}
              <motion.div variants={item} className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white">Growth Velocity</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">6 Month Trend</p>
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.growth_history || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} itemStyle={{ color: '#fff' }} />
                      <Area type="monotone" dataKey="signups" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSignups)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Plan Distribution (1/3) */}
              <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col">
                <h3 className="text-sm font-bold text-white mb-6">Plan Mix</h3>
                <div className="flex-1 space-y-5">
                  {stats?.members_by_plan && Object.entries(stats.members_by_plan).map(([plan, count]) => {
                    const total = Object.values(stats.members_by_plan).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={plan}>
                        <div className="flex justify-between text-[10px] mb-2 text-zinc-400 font-medium uppercase tracking-wide">
                          <span>{plan}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-white transition-all duration-1000" style={{ width: `${percentage}%`, opacity: percentage/100 + 0.3 }}></div>
                        </div>
                      </div>
                    )
                  })}
                  {(!stats?.members_by_plan || Object.keys(stats.members_by_plan).length === 0) && (
                    <div className="flex-1 flex items-center justify-center text-xs text-zinc-600">No plan data available</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ROW 3: DISPUTES */}
            <motion.div variants={item} className="bg-zinc-900/40 border border-orange-500/20 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="text-lg">⚠️</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Pending Disputes</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{disputes.length} awaiting review</p>
                  </div>
                </div>
                <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded px-2 py-1 font-bold">Live • 10s</span>
              </div>

              {disputesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              ) : disputesError ? (
                <div className="text-center py-8">
                  <p className="text-xs text-red-400">{disputesError}</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Check admin session and API permissions</p>
                </div>
              ) : disputes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-zinc-400">No pending disputes right now</p>
                  <p className="text-[10px] text-zinc-600 mt-1">New user disputes will appear here automatically</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-black/40 border border-orange-500/10 rounded-2xl p-4 hover:border-orange-500/30 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <button
                            onClick={() => openDisputeDetails(dispute)}
                            className="text-sm font-semibold text-white hover:text-orange-300 transition-colors text-left"
                          >
                            {dispute.user_name} vs {dispute.trainer_name}
                          </button>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            Booking #{dispute.id} • 📅 {new Date(dispute.preferred_date).toLocaleDateString()} • ⏰ {dispute.preferred_time}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded border border-orange-500/20">
                          DISPUTED
                        </span>
                      </div>
                      {dispute.dispute_reason && (
                        <p className="text-xs text-zinc-300 bg-orange-500/5 p-2 rounded mt-2">
                          "{dispute.dispute_reason}"
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDecisionModal('approve', dispute);
                          }}
                          className="flex-1 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded hover:bg-emerald-600/30 transition-colors border border-emerald-500/20 active:scale-95"
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDecisionModal('reject', dispute);
                          }}
                          className="flex-1 px-3 py-1.5 bg-red-600/20 text-red-400 text-xs font-bold rounded hover:bg-red-600/30 transition-colors border border-red-500/20 active:scale-95"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RECENT SIGNUPS */}
            <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h3 className="text-sm font-bold text-white">Recent Signups</h3>
                <div className="relative group w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 pl-9 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all"
                  />
                  <svg className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2 group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 pl-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">User</th>
                      <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Plan</th>
                      <th className="text-right py-3 pr-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSignups.length > 0 ? filteredSignups.map((member) => {
                      const memberImagePath =
                        member?.profile_photo ||
                        member?.profile_photo_url ||
                        member?.image ||
                        member?.image_url ||
                        member?.avatar ||
                        member?.photo ||
                        member?.profile_picture ||
                        null;
                      const memberImageUrl = toImageUrl(memberImagePath);

                      return (
                      <tr 
                        key={member.id} 
                        onClick={() => setSelectedUser(member)}
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-3">
                            {memberImageUrl ? (
                              <img
                                src={memberImageUrl}
                                alt={member.name || 'Member'}
                                className="w-7 h-7 rounded object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 border border-white/5">
                                {member.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-zinc-200">{member.name}</p>
                              <p className="text-[10px] text-zinc-600">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${member.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {member.active ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="py-3"><span className="text-xs text-zinc-400">{member.plan}</span></td>
                        <td className="py-3 pr-2 text-right"><span className="text-[10px] font-mono text-zinc-600">{member.joined_at}</span></td>
                      </tr>
                    );}) : (
                      <tr><td colSpan="4" className="py-8 text-center text-xs text-zinc-600">No members found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* TRANSACTION HISTORY */}
            <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">All payments system-wide</p>
                  </div>
                </div>
                {transactions.length > 0 && (
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 font-bold">
                    {transactions.length} Recent
                  </span>
                )}
              </div>

              {transactionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs text-zinc-500">Loading transactions...</span>
                  </div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-400">No transactions yet</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Payment history will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 pl-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Member</th>
                        <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                        <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Item</th>
                        <th className="text-left py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Method</th>
                        <th className="text-right py-3 pr-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((txn, idx) => {
                        const txnImagePath =
                          txn?.user_profile_photo ||
                          txn?.profile_photo ||
                          txn?.profile_photo_url ||
                          txn?.user_image ||
                          txn?.image ||
                          txn?.avatar ||
                          txn?.photo ||
                          null;
                        const txnImageUrl = toImageUrl(txnImagePath);

                        return (
                        <tr 
                          key={txn.id || idx} 
                          className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => txn.user_id && setSelectedUser({ id: txn.user_id, name: txn.user_name })}
                        >
                          <td className="py-3 pl-2">
                            <div className="text-xs text-zinc-400">{txn.date}</div>
                            <div className="text-[10px] text-zinc-600">{txn.time}</div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {txnImageUrl ? (
                                <img
                                  src={txnImageUrl}
                                  alt={txn.user_name || 'User'}
                                  className="w-6 h-6 rounded object-cover border border-white/10"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 border border-white/5">
                                  {(txn.user_name || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-medium text-zinc-200">{txn.user_name || 'Unknown'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                              txn.type === 'membership' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : txn.type === 'trainer_package'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                            }`}>
                              {txn.type === 'membership' ? 'MEMBERSHIP' : 
                               txn.type === 'trainer_package' ? 'TRAINER' : 
                               txn.type?.toUpperCase() || 'OTHER'}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-zinc-400 max-w-[200px] truncate">
                            {txn.description || txn.item || '—'}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              {txn.payment_method === 'stripe' && (
                                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                                </svg>
                              )}
                              <span className="text-xs text-zinc-500">
                                {txn.payment_method === 'stripe' ? 'Stripe' : 'Card'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <span className="text-sm font-bold text-emerald-400">{formatCurrency(txn.amount)}</span>
                          </td>
                        </tr>
                      );})}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>

          {/* === RIGHT COLUMN (THE PULSE SIDEBAR) - Span 3 === */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            
            {/* Live Activity Feed Box */}
            <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm h-auto">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                Live Activity
              </h3>
              
              <div className="space-y-6">
                {/* Today Stats */}
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Signups Today</p>
                    <p className="text-2xl font-bold text-white mt-1">{stats?.signups_today || 0}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>

                {/* Week Stats */}
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">This Week</p>
                    <p className="text-2xl font-bold text-white mt-1">{stats?.new_signups_7_days || 0}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Currently In Gym */}
            <motion.div variants={item} className="bg-gradient-to-b from-emerald-900/10 to-zinc-900/40 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  In Gym Now
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-400">{activeAttendance.length}</span>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {attendanceLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  </div>
                ) : activeAttendance.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-xs text-zinc-400">Gym is empty</p>
                    <p className="text-[10px] text-zinc-600 mt-1">No active check-ins</p>
                  </div>
                ) : (
                  activeAttendance.map((member) => (
                    <div 
                      key={member.id} 
                      className="group p-3 rounded-xl bg-black/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                      onClick={() => setSelectedUser(member)}
                    >
                      <div className="flex items-center gap-3">
                        {member.profile_photo ? (
                          <img 
                            src={`http://localhost:3000${member.profile_photo}`}
                            alt={member.name}
                            className="w-10 h-10 rounded-lg object-cover border border-emerald-500/20"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm font-bold text-emerald-500 ${member.profile_photo ? 'hidden' : ''}`}>
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-200 truncate">{member.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[10px] text-emerald-400 font-medium">{member.check_in_time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500">{member.duration || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {staleAttendance.length > 0 && (
                <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <button
                    type="button"
                    onClick={() => setShowStaleAttendance(prev => !prev)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                        Stale check-ins hidden: {staleAttendance.length}
                      </p>
                      <span className="text-[10px] text-amber-300">
                        {showStaleAttendance ? 'Hide' : 'Show'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      These members appear checked in for over 6 hours and may need a checkout scan.
                    </p>
                  </button>

                  {showStaleAttendance && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                      {staleAttendance.map((member) => (
                        <div
                          key={`stale-${member.id}`}
                          className="p-2 rounded-lg bg-black/40 border border-amber-500/20"
                        >
                          <p className="text-xs text-zinc-200 font-semibold truncate">{member.name}</p>
                          <p className="text-[10px] text-amber-300 mt-0.5">Duration: {member.duration || '—'}</p>
                          <p className="text-[10px] text-zinc-500">Check-in: {member.check_in_time || '—'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeAttendance.length > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-500/10">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">Last updated</span>
                    <span className="text-emerald-500 font-medium">Live • 30s refresh</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Class Check-In Section */}
            <motion.div variants={item} className="bg-gradient-to-b from-blue-900/10 to-zinc-900/40 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-sm min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" /></svg>
                    Class Operations
                  </h3>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20">
                    {classOpsTab === 'today' ? 'Today Ops' : 'Upcoming Bookings'}
                  </span>
                </div>
                <div className="flex items-center gap-1 p-1 bg-black/30 rounded-lg border border-blue-500/20">
                  <button
                    type="button"
                    onClick={() => setClassOpsTab('today')}
                    className={`px-2.5 py-1 text-[10px] rounded-md font-semibold transition ${classOpsTab === 'today' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setClassOpsTab('upcoming')}
                    className={`px-2.5 py-1 text-[10px] rounded-md font-semibold transition ${classOpsTab === 'upcoming' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className={`space-y-3 ${classOpsTab === 'upcoming' ? 'max-h-[460px] overflow-y-auto pr-1' : ''}`}>
                {(classOpsTab === 'today' ? sessionsLoading : allSessionsLoading) ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : (classOpsTab === 'today' ? todaySessions : allSessions).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                      </svg>
                    </div>
                    <p className="text-xs text-zinc-400">{classOpsTab === 'today' ? 'No classes today' : 'No upcoming sessions'}</p>
                  </div>
                ) : (
                  (classOpsTab === 'today' ? todaySessions : allSessions).map((session) => (
                    <div 
                      key={session.id} 
                      onClick={() => openSessionDetails(session)}
                      className="p-4 rounded-xl bg-black/40 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-blue-300 group-hover:text-blue-200 transition">{session.class_name}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            <span className="inline-block mr-2">⏰ {session.formatted_time}</span>
                            <span className="inline-block">👨‍🏫 {session.instructor}</span>
                          </p>
                          {classOpsTab === 'upcoming' && (
                            <p className="text-[10px] text-zinc-500 mt-1">{session.formatted_date || session.scheduled_date || 'Date TBD'}</p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${session.capacity > 0 ? (session.booked_count / session.capacity) * 100 : 0}%` }}
                              ></div>
                            </div>
                            <p className="text-[10px] font-semibold text-zinc-300 min-w-fit">
                              {session.booked_count}/{session.capacity}
                            </p>
                          </div>
                          <p className="text-[9px] text-blue-400 mt-1.5 opacity-0 group-hover:opacity-100 transition">Click to view attendees →</p>
                        </div>

                        {classOpsTab === 'today' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddWalkin(session.id);
                            }}
                            disabled={addWalkinLoading || session.is_full}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-all ${
                              session.is_full
                                ? 'bg-red-500/10 text-red-400 cursor-not-allowed border border-red-500/20'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/50 border border-blue-500/30'
                            } disabled:opacity-50`}
                          >
                            {session.is_full ? 'Full' : 'Add Walk-in'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md whitespace-nowrap">
                            Attendees: {Array.isArray(session.booked_members) ? session.booked_members.length : Number(session.booked_count || 0)}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-500">
                        Spots remaining: <span className="text-blue-400 font-semibold">{session.spots_remaining}</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Expiring Soon Alert Box */}
            <motion.div variants={item} className="bg-gradient-to-b from-amber-900/10 to-zinc-900/40 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-sm min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Expiring Soon
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">7 Days</span>
              </div>

              <div className="space-y-3">
                {stats?.expiring_soon?.length > 0 ? (
                  stats.expiring_soon.map((member) => (
                    <div key={member.id} className="group p-3 rounded-xl bg-black/40 border border-amber-500/10 hover:border-amber-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-500">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200">{member.name}</p>
                            <p className="text-[10px] text-zinc-500">{member.plan}</p>
                          </div>
                        </div>
                        <button className="text-[10px] text-amber-500 hover:text-amber-400 font-medium">Renew</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-xs text-zinc-400">All memberships active.</p>
                    <p className="text-[10px] text-zinc-600 mt-1">No expirations in next 7 days.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-gradient-to-b from-sky-900/10 to-zinc-900/40 border border-sky-500/20 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">All Users</h3>
                <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                  {usersDirectory.length}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {allUsersLoading && usersDirectory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">Loading users...</div>
                ) : usersDirectory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-600">No users available</div>
                ) : (
                  usersDirectory.slice(0, 40).map((member, idx) => {
                    const imageUrl = toImageUrl(member?.profile_photo || member?.profile_photo_url || member?.user?.profile_photo);
                    return (
                      <button
                        type="button"
                        key={member.id || member.user_id || idx}
                        onClick={() => setSelectedUser(member)}
                        className="w-full text-left p-2.5 rounded-xl bg-black/40 border border-sky-500/10 hover:border-sky-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <img src={imageUrl} alt={member.name || member.user_name || 'User'} className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[11px] font-bold text-sky-300">
                              {(member.name || member.user_name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-zinc-200 font-semibold truncate">{member.name || member.user_name || 'Unknown user'}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{member.email || member.user_email || 'No email'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-gradient-to-b from-purple-900/10 to-zinc-900/40 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">All Trainers</h3>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                  {trainersDirectory.length}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {allTrainersLoading && trainersDirectory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">Loading trainers...</div>
                ) : trainersDirectory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-600">No trainers available</div>
                ) : (
                  trainersDirectory.slice(0, 40).map((trainer, idx) => {
                    const trainerImagePath =
                      trainer?.profile_photo ||
                      trainer?.profile_photo_url ||
                      trainer?.image ||
                      trainer?.image_url ||
                      trainer?.avatar ||
                      trainer?.photo ||
                      trainer?.profile_picture ||
                      trainer?.trainer_image ||
                      trainer?.user?.profile_photo ||
                      trainer?.user?.profile_photo_url ||
                      null;
                    const imageUrl = toImageUrl(trainerImagePath);
                    return (
                      <button
                        type="button"
                        key={trainer.trainer_id || trainer.id || idx}
                        onClick={() => setSelectedTrainer({
                          ...trainer,
                          trainer_id: trainer.trainer_id || trainer.id,
                          trainer_name: trainer.trainer_name || trainer.name
                        })}
                        className="w-full text-left p-2.5 rounded-xl bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <img src={imageUrl} alt={trainer.trainer_name || trainer.name || 'Trainer'} className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[11px] font-bold text-purple-300">
                              {(trainer.trainer_name || trainer.name || 'T').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-zinc-200 font-semibold truncate">{trainer.trainer_name || trainer.name || 'Unknown trainer'}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{trainer.email || trainer.trainer_email || trainer.role_title || trainer.role || trainer.specialty || 'No details'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>

          </div>

        </motion.div>
      </main>

      {decisionModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {decisionModal.action === 'approve' ? 'Approve Dispute' : 'Reject Dispute'}
            </h3>
            <p className="text-xs text-zinc-400 mt-2">
              Booking #{decisionModal.dispute?.id} • {decisionModal.dispute?.user_name} vs {decisionModal.dispute?.trainer_name}
            </p>
            <div className={`mt-4 rounded-xl p-3 border text-xs ${decisionModal.action === 'approve' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
              {decisionModal.action === 'approve'
                ? 'Approving restores the member session credit (e.g. 5/6 → 6/6).'
                : 'Rejecting keeps the session deducted (e.g. stays 5/6).'}
            </div>
            {decisionModal.dispute?.dispute_reason && (
              <p className="mt-4 text-xs text-zinc-300 bg-white/5 border border-white/10 rounded-lg p-3">
                “{decisionModal.dispute.dispute_reason}”
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDecisionModal}
                disabled={decisionModal.loading}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeDecision}
                disabled={decisionModal.loading}
                className={`px-4 py-2 text-xs font-bold rounded-lg border disabled:opacity-50 ${decisionModal.action === 'approve' ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/30' : 'bg-red-600/20 text-red-300 border-red-500/30 hover:bg-red-600/30'}`}
              >
                {decisionModal.loading ? 'Processing...' : decisionModal.action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {disputeDetailModal.isOpen && disputeDetailModal.dispute && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            {(() => {
              const memberEmail = selectedDisputeContext.user?.email;
              const memberPhone = selectedDisputeContext.user?.phone;
              const trainerEmail = selectedDisputeContext.trainer?.email || disputeDetailModal.dispute?.trainer_email;
              const trainerPhone = selectedDisputeContext.trainer?.phone || disputeDetailModal.dispute?.trainer_phone;
              const trainerImagePath =
                selectedDisputeContext.trainer?.profile_photo ||
                selectedDisputeContext.trainer?.profile_photo_url ||
                selectedDisputeContext.trainer?.image ||
                selectedDisputeContext.trainer?.image_url ||
                selectedDisputeContext.trainer?.avatar ||
                selectedDisputeContext.trainer?.photo ||
                selectedDisputeContext.trainer?.profile_picture ||
                selectedDisputeContext.trainer?.trainer_image ||
                selectedDisputeContext.trainer?.user?.profile_photo ||
                selectedDisputeContext.trainer?.user?.profile_photo_url ||
                null;
              const trainerImageUrl = toImageUrl(trainerImagePath);

              return (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Dispute Details</h3>
                      <p className="text-xs text-zinc-400 mt-1">Booking #{disputeDetailModal.dispute.id} • {disputeDetailModal.dispute.user_name} vs {disputeDetailModal.dispute.trainer_name}</p>
                    </div>
                    <button
                      onClick={closeDisputeDetails}
                      className="text-zinc-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-zinc-500">Scheduled Date</p>
                      <p className="text-zinc-200 font-semibold mt-1">{new Date(disputeDetailModal.dispute.preferred_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <p className="text-zinc-500">Scheduled Time</p>
                      <p className="text-zinc-200 font-semibold mt-1">{disputeDetailModal.dispute.preferred_time || '—'}</p>
                    </div>
                  </div>

                  {disputeDetailModal.dispute.dispute_reason && (
                    <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                      <p className="text-orange-300 text-[11px] font-bold">Dispute Reason</p>
                      <p className="text-zinc-200 text-sm mt-1">“{disputeDetailModal.dispute.dispute_reason}”</p>
                    </div>
                  )}

                  {disputeContextLoading ? (
                    <div className="mt-6 flex items-center justify-center py-6">
                      <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Member Contact</p>
                        <div className="flex items-center gap-3 mt-2">
                          {(selectedDisputeContext.user?.profile_photo || selectedDisputeContext.user?.user?.profile_photo) ? (
                            <img 
                              src={`http://localhost:3000${selectedDisputeContext.user?.profile_photo || selectedDisputeContext.user?.user?.profile_photo}`} 
                              alt={disputeDetailModal.dispute.user_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                              {(disputeDetailModal.dispute.user_name || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="text-sm font-semibold text-white">{disputeDetailModal.dispute.user_name || '—'}</p>
                        </div>
                        <div className="mt-1">
                          {memberEmail ? (
                            <a
                              href={`mailto:${memberEmail}`}
                              className="text-xs text-sky-300 hover:text-sky-200 underline underline-offset-2"
                            >
                              📧 {memberEmail}
                            </a>
                          ) : (
                            <p className="text-xs text-zinc-500">Email not available</p>
                          )}
                        </div>
                        <div className="mt-1">
                          {memberPhone ? (
                            <a
                              href={`tel:${normalizePhone(memberPhone)}`}
                              className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                            >
                              📱 {memberPhone}
                            </a>
                          ) : (
                            <p className="text-xs text-zinc-500">Phone not available</p>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {memberEmail && (
                            <a href={`mailto:${memberEmail}`} className="px-2 py-1 text-[10px] font-bold rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20">Email</a>
                          )}
                          {memberPhone && (
                            <a href={`tel:${normalizePhone(memberPhone)}`} className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">Call</a>
                          )}
                          {memberPhone && (
                            <a href={`https://wa.me/${whatsappNumber(memberPhone)}`} target="_blank" rel="noreferrer" className="px-2 py-1 text-[10px] font-bold rounded bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20">WhatsApp</a>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-1">User ID: {disputeDetailModal.dispute.user_id || selectedDisputeContext.user?.id || '—'}</p>
                      </div>

                      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider">Trainer Contact</p>
                        <div className="flex items-center gap-3 mt-2">
                          {trainerImageUrl ? (
                            <img 
                              src={trainerImageUrl}
                              alt={disputeDetailModal.dispute.trainer_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                              {(disputeDetailModal.dispute.trainer_name || 'T').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="text-sm font-semibold text-white">{disputeDetailModal.dispute.trainer_name || '—'}</p>
                        </div>
                        <div className="mt-1">
                          {trainerEmail ? (
                            <a
                              href={`mailto:${trainerEmail}`}
                              className="text-xs text-sky-300 hover:text-sky-200 underline underline-offset-2"
                            >
                              📧 {trainerEmail}
                            </a>
                          ) : (
                            <p className="text-xs text-zinc-500">Email not available</p>
                          )}
                        </div>
                        <div className="mt-1">
                          {trainerPhone ? (
                            <a
                              href={`tel:${normalizePhone(trainerPhone)}`}
                              className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                            >
                              📱 {trainerPhone}
                            </a>
                          ) : (
                            <p className="text-xs text-zinc-500">Phone not available</p>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {trainerEmail && (
                            <a href={`mailto:${trainerEmail}`} className="px-2 py-1 text-[10px] font-bold rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20">Email</a>
                          )}
                          {trainerPhone && (
                            <a href={`tel:${normalizePhone(trainerPhone)}`} className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">Call</a>
                          )}
                          {trainerPhone && (
                            <a href={`https://wa.me/${whatsappNumber(trainerPhone)}`} target="_blank" rel="noreferrer" className="px-2 py-1 text-[10px] font-bold rounded bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20">WhatsApp</a>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-1">Trainer ID: {disputeDetailModal.dispute.trainer_id || selectedDisputeContext.trainer?.id || '—'}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={closeDisputeDetails}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Trainer Detail Modal */}
      <TrainerDetailModal
        isOpen={!!selectedTrainer}
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
      />
      <UserDetailModal
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <AdminOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onCreated={handleOnboardingCreated}
      />

      {/* Session Details Modal */}
      {sessionDetailsModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-zinc-800">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{sessionDetailsModal.session?.class_name}</h2>
                <p className="text-blue-100 text-sm mt-1">{sessionDetailsModal.session?.formatted_date}</p>
              </div>
              <button 
                onClick={closeSessionDetails}
                className="text-blue-100 hover:text-white hover:bg-blue-800 p-2 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{maxHeight: 'calc(80vh - 100px)'}}>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                  <p className="text-zinc-400 text-xs mb-1">Instructor</p>
                  <p className="text-white font-semibold">{sessionDetailsModal.session?.instructor}</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                  <p className="text-zinc-400 text-xs mb-1">Capacity</p>
                  <p className="text-white font-semibold">{sessionDetailsModal.session?.booked_count}/{sessionDetailsModal.session?.capacity}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Attendees</h3>
                  <div className="flex items-center gap-1 p-1 bg-zinc-900/70 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setAttendeeFilter('all')}
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold transition ${attendeeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      All ({totalAttendees})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendeeFilter('members')}
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold transition ${attendeeFilter === 'members' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      Members ({memberAttendees})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendeeFilter('walkins')}
                      className={`px-2 py-1 text-[10px] rounded-md font-semibold transition ${attendeeFilter === 'walkins' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      Walk-ins ({walkinAttendees})
                    </button>
                  </div>
                </div>

                {sessionDetailsModal.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : filteredSessionMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 text-sm">
                      {Number(sessionDetailsModal.session?.booked_count || 0) > 0
                        ? (attendeeFilter === 'walkins'
                            ? 'No walk-ins in this session yet.'
                            : attendeeFilter === 'members'
                              ? 'No registered members in this session yet.'
                              : 'Attendee details not returned yet.')
                        : 'No bookings yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSessionMembers.map((member, idx) => {
                      const isWalkin = Boolean(member?.is_walkin);
                      const displayName = member?.name || member?.user_name || (isWalkin ? 'Walk-in' : 'Member');
                      const displayEmail = member?.email || member?.user_email || null;
                      const displayPhone = member?.phone || member?.user_phone || null;

                      return (
                      <div key={member?.booking_id || member?.id || idx} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-blue-500/30 transition">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                          {(displayName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate">{displayName}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{displayEmail || 'No email'}</p>
                          {displayPhone && <p className="text-[10px] text-zinc-600 truncate">📱 {displayPhone}</p>}
                          {member?.booking_id && <p className="text-[10px] text-zinc-600 truncate">Booking #{member.booking_id}</p>}
                        </div>
                        {isWalkin && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/20 whitespace-nowrap">Walk-in</span>}
                      </div>
                    );})}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;