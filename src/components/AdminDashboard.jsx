import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

function AdminDashboard({ user, onLogout, onOpenScanner }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-12 gap-6">
          
          {/* === LEFT COLUMN (MAIN STATS) - Span 9 === */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* ROW 1: KEY METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Members */}
              <motion.div variants={item} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl backdrop-blur-sm group hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Members</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
                <div className="text-3xl font-medium text-white tracking-tight">{stats?.total_members}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Lifetime registrations</div>
              </motion.div>

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

            {/* ROW 3: MEMBER DIRECTORY */}
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

              <div className="overflow-x-auto">
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
                    {filteredSignups.length > 0 ? filteredSignups.map((member) => (
                      <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 border border-white/5">
                              {member.name?.charAt(0).toUpperCase()}
                            </div>
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
                    )) : (
                      <tr><td colSpan="4" className="py-8 text-center text-xs text-zinc-600">No members found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
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

          </div>

        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;