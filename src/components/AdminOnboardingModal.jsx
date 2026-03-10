import React, { useMemo, useState } from 'react';

function AdminOnboardingModal({ isOpen, onClose, onCreated }) {
  const [role, setRole] = useState('member');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    // Shared
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    address: '',

    // Member-specific
    membershipPlan: 'basic',
    membershipStartDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    paymentAmount: '',
    paymentReference: '',
    paymentStatus: 'paid',

    // Trainer-specific
    role_title: '',
    bio: '',
    experienceYears: '',
    certifications: '',
    employmentType: 'commission',
    commissionRate: '60',
    instagram: '',
    facebook: '',
    twitter: '',

    // Admin-specific
    adminAccessLevel: 'standard',
    adminDepartment: 'operations',
    adminNotes: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const roleConfig = useMemo(() => ({
    member: {
      label: 'Member',
      description: 'Walk-in gym member onboarding',
      accent: 'from-sky-500 to-blue-600'
    },
    trainer: {
      label: 'Trainer',
      description: 'Coach profile & work details',
      accent: 'from-violet-500 to-purple-600'
    },
    admin: {
      label: 'Admin',
      description: 'Staff account with system access',
      accent: 'from-emerald-500 to-green-600'
    }
  }), []);

  const membershipPricing = useMemo(() => ({
    basic: '49',
    premium: '79',
    elite: '99'
  }), []);

  const updateField = (key, value) => {
    setForm(prev => {
      const updated = { ...prev, [key]: value };
      // Auto-calculate payment amount when membership plan changes
      if (key === 'membershipPlan') {
        updated.paymentAmount = membershipPricing[value] || '';
      }
      return updated;
    });
  };

  const resetModal = () => {
    setError(null);
    setSubmitting(false);
    setRole('member');
    setPhotoFile(null);
    setPhotoPreview(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      membershipPlan: 'basic',
      membershipStartDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      paymentAmount: '49',
      paymentReference: '',
      paymentStatus: 'paid',
      role_title: '',
      bio: '',
      experienceYears: '',
      certifications: '',
      employmentType: 'commission',
      commissionRate: '60',
      instagram: '',
      facebook: '',
      twitter: '',
      adminAccessLevel: 'standard',
      adminDepartment: 'operations',
      adminNotes: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getEndpoints = () => {
    if (role === 'member') return ['http://localhost:3000/admin/users', 'http://localhost:3000/admin/members'];
    if (role === 'trainer') return ['http://localhost:3000/admin/trainers'];
    return ['http://localhost:3000/admin/admin_users', 'http://localhost:3000/admin/staff/admins'];
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!form.phone.trim()) return 'Phone is required.';
    if (form.password && form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';

    if (role === 'member') {
      if (!form.membershipPlan) return 'Select a membership plan.';
      if (!form.membershipStartDate) return 'Membership start date is required.';
      if (!form.paymentAmount || Number(form.paymentAmount) <= 0) return 'Enter valid payment amount.';
    }

    if (role === 'trainer') {
      if (!form.role_title.trim()) return 'Trainer role/title is required.';
    }

    return null;
  };

  const buildPayload = () => {
    const fd = new FormData();

    fd.append('role', role);
    fd.append('name', form.name.trim());
    fd.append('email', form.email.trim());
    fd.append('phone', form.phone.trim());
    if (form.password) fd.append('password', form.password);
    if (form.gender) fd.append('gender', form.gender);
    if (form.dateOfBirth) fd.append('date_of_birth', form.dateOfBirth);
    if (form.address) fd.append('address', form.address);
    if (photoFile) fd.append('profile_photo', photoFile);

    if (role === 'member') {
      fd.append('membership_plan', form.membershipPlan);
      fd.append('membership_start_date', form.membershipStartDate);
      fd.append('payment_method', form.paymentMethod);
      fd.append('payment_amount', form.paymentAmount);
      fd.append('payment_reference', form.paymentReference);
      fd.append('payment_status', form.paymentStatus);
    }

    if (role === 'trainer') {
      fd.append('role_title', form.role_title);
      fd.append('bio', form.bio);
      fd.append('experience_years', form.experienceYears || '0');
      fd.append('certifications', form.certifications);
      fd.append('employment_type', form.employmentType);
      fd.append('commission_rate', form.commissionRate || '60');
      fd.append('instagram', form.instagram || '');
      fd.append('facebook', form.facebook || '');
      fd.append('twitter', form.twitter || '');
    }

    if (role === 'admin') {
      fd.append('access_level', form.adminAccessLevel);
      fd.append('department', form.adminDepartment);
      fd.append('notes', form.adminNotes);
    }

    return fd;
  };

  const submitToFirstWorkingEndpoint = async (payload) => {
    const endpoints = getEndpoints();
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          body: payload
        });

        if (res.status === 404) continue;

        if (!res.ok) {
          let msg = 'Failed to create account.';
          try {
            const errData = await res.json();
            msg = errData?.error || errData?.message || msg;
          } catch {
            // fallback message
          }
          throw new Error(msg);
        }

        return res.json();
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('No working endpoint found for this role.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildPayload();
      const created = await submitToFirstWorkingEndpoint(payload);
      onCreated?.(role, created);
      handleClose();
    } catch (err) {
      setError(err.message || 'Unable to create account.');
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = 'w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition';
  const labelClass = 'text-[11px] uppercase tracking-wider font-bold text-zinc-500';

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className={`p-6 bg-gradient-to-r ${roleConfig[role].accent}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Reception Onboarding</p>
              <h2 className="text-2xl font-black text-white mt-1">Create New Account</h2>
              <p className="text-sm text-white/90 mt-1">Detailed role-based onboarding for members, trainers, and admins.</p>
            </div>
            <button onClick={handleClose} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.keys(roleConfig).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`text-left rounded-2xl border p-4 transition ${role === key ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
              >
                <p className="text-sm font-bold text-white">{roleConfig[key].label}</p>
                <p className="text-xs text-zinc-400 mt-1">{roleConfig[key].description}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-4">Core Identity</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="jane@email.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+254 700 000 000" />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input className={inputClass} type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input className={inputClass} value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="City, Street" />
                  </div>
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-4">Security Setup</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password</label>
                    <input className={inputClass} type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="At least 6 characters" />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input className={inputClass} type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Repeat password" />
                  </div>
                </div>
              </div>

              {role === 'member' && (
                <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold text-sky-300">Member Plan & Physical Payment</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Membership Plan</label>
                      <select className={inputClass} value={form.membershipPlan} onChange={(e) => updateField('membershipPlan', e.target.value)}>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="elite">Elite</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input className={inputClass} type="date" value={form.membershipStartDate} onChange={(e) => updateField('membershipStartDate', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>Payment Method</label>
                      <select className={inputClass} value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)}>
                        <option value="cash">Cash</option>
                        <option value="card">Card/POS</option>
                        <option value="transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Amount Paid (Auto-calculated)</label>
                      <div className="relative">
                        <input 
                          className={`${inputClass} bg-black/60 cursor-not-allowed`} 
                          type="text" 
                          value={`$${form.paymentAmount}`} 
                          readOnly 
                          placeholder="$0.00" 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-sky-400">from plan</span>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Payment Reference</label>
                      <input className={inputClass} value={form.paymentReference} onChange={(e) => updateField('paymentReference', e.target.value)} placeholder="Receipt / Txn code" />
                    </div>
                    <div>
                      <label className={labelClass}>Payment Status</label>
                      <select className={inputClass} value={form.paymentStatus} onChange={(e) => updateField('paymentStatus', e.target.value)}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {role === 'trainer' && (
                <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold text-violet-300">Trainer Professional Profile</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Role Title</label>
                      <input className={inputClass} value={form.role_title} onChange={(e) => updateField('role_title', e.target.value)} placeholder="Strength Coach / HIIT Specialist" />
                    </div>
                    <div>
                      <label className={labelClass}>Experience (Years)</label>
                      <input className={inputClass} type="number" min="0" value={form.experienceYears} onChange={(e) => updateField('experienceYears', e.target.value)} placeholder="3" />
                    </div>
                    <div>
                      <label className={labelClass}>Employment Type</label>
                      <select className={inputClass} value={form.employmentType} onChange={(e) => updateField('employmentType', e.target.value)}>
                        <option value="commission">Commission</option>
                        <option value="salary">Salary</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Commission Rate (%)</label>
                      <input className={inputClass} type="number" min="0" max="100" value={form.commissionRate} onChange={(e) => updateField('commissionRate', e.target.value)} placeholder="60" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Certifications</label>
                      <input className={inputClass} value={form.certifications} onChange={(e) => updateField('certifications', e.target.value)} placeholder="ACE, NASM, CPR..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Bio</label>
                      <textarea className={inputClass} rows={3} value={form.bio} onChange={(e) => updateField('bio', e.target.value)} placeholder="Short trainer introduction..." />
                    </div>
                    <div>
                      <label className={labelClass}>Instagram URL</label>
                      <input className={inputClass} type="url" value={form.instagram} onChange={(e) => updateField('instagram', e.target.value)} placeholder="https://instagram.com/username" />
                    </div>
                    <div>
                      <label className={labelClass}>Facebook URL</label>
                      <input className={inputClass} type="url" value={form.facebook} onChange={(e) => updateField('facebook', e.target.value)} placeholder="https://facebook.com/username" />
                    </div>
                    <div>
                      <label className={labelClass}>Twitter/X URL</label>
                      <input className={inputClass} type="url" value={form.twitter} onChange={(e) => updateField('twitter', e.target.value)} placeholder="https://twitter.com/username" />
                    </div>
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold text-emerald-300">Admin Access Configuration</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Access Level</label>
                      <select className={inputClass} value={form.adminAccessLevel} onChange={(e) => updateField('adminAccessLevel', e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="manager">Manager</option>
                        <option value="super">Super Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Department</label>
                      <select className={inputClass} value={form.adminDepartment} onChange={(e) => updateField('adminDepartment', e.target.value)}>
                        <option value="operations">Operations</option>
                        <option value="finance">Finance</option>
                        <option value="support">Support</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Notes</label>
                      <textarea className={inputClass} rows={3} value={form.adminNotes} onChange={(e) => updateField('adminNotes', e.target.value)} placeholder="Permissions, shift details, onboarding notes..." />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-3">Profile Photo</p>
                <label className="block border border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-white/40 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setPhotoFile(file);
                      if (!file) {
                        setPhotoPreview(null);
                        return;
                      }
                      const objectUrl = URL.createObjectURL(file);
                      setPhotoPreview(objectUrl);
                    }}
                  />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-28 h-28 rounded-xl object-cover mx-auto border border-white/10" />
                  ) : (
                    <>
                      <p className="text-xs text-zinc-300">Upload image</p>
                      <p className="text-[10px] text-zinc-500 mt-1">PNG/JPG recommended</p>
                    </>
                  )}
                </label>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <p className="text-xs font-bold text-white mb-2">Role Summary</p>
                <p className="text-xs text-zinc-400">Creating as <span className="text-white font-semibold">{roleConfig[role].label}</span>.</p>
                <p className="text-[11px] text-zinc-500 mt-2">This creates an account immediately for front-desk operations and tracking.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white text-sm font-bold transition"
              >
                {submitting ? 'Creating account...' : `Create ${roleConfig[role].label}`}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminOnboardingModal;
