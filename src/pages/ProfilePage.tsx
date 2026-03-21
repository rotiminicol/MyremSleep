import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Edit2, Save, X, Check, Lock,
  Bell, Package, Heart, LogOut, ChevronRight,
  Shield, Eye, EyeOff, Globe, Sparkles, Loader2
} from 'lucide-react';
import { StoreNavbar } from '../components/store/StoreNavbar';
import { useCustomerStore } from '@/stores/customerStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// ── 3D Tilt ───────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5 * intensity, -5 * intensity]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6 * intensity, 6 * intensity]), { stiffness: 100, damping: 22 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    y.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };

  return (
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? 'bg-primary' : 'bg-[#d8d1c8]'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </motion.button>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────
const inputBase = "w-full px-4 py-3.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8f877d]/30 focus:border-[#8f877d] transition-all duration-200";
const inputDisabled = "w-full px-4 py-3.5 bg-[#f2ede8]/50 border border-[#ede9e4] rounded-xl text-[15px] text-gray-500 cursor-default";

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-[#8f877d] tracking-[0.12em] uppercase">{label}</label>
      {children}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <TiltCard intensity={1.5}>
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#c4bbb1] to-[#a09890] shadow-xl flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-white text-2xl" style={{ transform: 'translateZ(10px)' }}>{initials}</span>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </TiltCard>
  );
}

const SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPw, setShowPw] = useState({ cur: false, new: false, confirm: false });
  const [showPwForm, setShowPwForm] = useState(false);

  const { profile, isLoading, isLoggedIn, logout, updateProfile, updateAddress, refreshProfile } = useCustomerStore();

  const [draft, setDraft] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [addressDraft, setAddressDraft] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    zip: '',
    country: '',
  });
  const [pw, setPw] = useState({ cur: '', new: '', confirm: '' });
  const [preferences, setPreferences] = useState({ newsletter: true, orderUpdates: true, promotions: false });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/store');
    } else {
      refreshProfile();
    }
  }, []);

  // Sync draft with profile data
  useEffect(() => {
    if (profile) {
      setDraft({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
      setAddressDraft({
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        province: profile.province || '',
        zip: profile.zip || '',
        country: profile.country || '',
      });
    }
  }, [profile]);

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSave = async () => {
    const success = await updateProfile({
      firstName: draft.firstName,
      lastName: draft.lastName,
      phone: draft.phone,
    });
    if (success) {
      setIsEditing(false);
      triggerSuccess();
    } else {
      toast.error('Failed to update profile', { position: 'top-center' });
    }
  };

  const handleSaveAddress = async () => {
    const success = await updateAddress(addressDraft);
    if (success) {
      setIsEditingAddress(false);
      triggerSuccess();
    } else {
      toast.error('Failed to update address', { position: 'top-center' });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.new !== pw.confirm) {
      toast.error('Passwords do not match', { position: 'top-center' });
      return;
    }
    if (pw.new.length < 6) {
      toast.error('Password must be at least 6 characters', { position: 'top-center' });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) {
      toast.error(error.message, { position: 'top-center' });
    } else {
      setShowPwForm(false);
      setPw({ cur: '', new: '', confirm: '' });
      toast.success('Password updated', { position: 'top-center' });
    }
  };

  const handleSignOut = async () => {
    await logout();
    setShowSignOutModal(false);
    navigate('/store');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f5f1ed] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
  const hasAddress = profile.address_line1 || profile.city || profile.country;

  return (
    <div className="min-h-screen bg-[#F2EDE8] overflow-x-hidden" style={{ fontFamily: 'Montserrat' }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div className="absolute top-[-80px] right-0 w-[500px] h-[500px] rounded-full bg-[#d4ccc3] blur-[100px] opacity-20"
          animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#c8c0b7] blur-[90px] opacity-15"
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, delay: 4 }} />
      </div>
      
      <StoreNavbar />

      <main className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-16 pb-24">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
          <span className="text-[10px] tracking-[0.5em] text-[#8f877d] block mb-3 uppercase font-medium">My Account</span>
          <h1 className="text-[clamp(40px,5.5vw,72px)] font-serif text-gray-900 leading-none tracking-tight">
            Profile Settings
          </h1>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-primary text-white px-5 py-3.5 rounded-2xl shadow-2xl"
            >
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium">Changes saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* ── Sidebar ── */}
          <div className="space-y-4 lg:sticky lg:top-8">
            <TiltCard intensity={0.5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/75 backdrop-blur-lg rounded-2xl p-6 border border-white/80 shadow-sm text-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex justify-center mb-4" style={{ transform: 'translateZ(12px)' }}>
                  <Avatar name={fullName} />
                </div>
                <h3 className="text-gray-900 text-xl mb-0.5" style={{ transform: 'translateZ(6px)' }}>{fullName}</h3>
                <p className="text-xs text-[#8f877d]">{profile.email}</p>

                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-[#f0ece7] rounded-full">
                  <Sparkles className="w-3 h-3 text-[#8f877d]" />
                  <span className="text-[11px] text-[#8f877d] font-medium">
                    Member since {new Date(profile.created_at).getFullYear()}
                  </span>
                </div>
              </motion.div>
            </TiltCard>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/75 backdrop-blur-lg rounded-2xl border border-white/80 shadow-sm overflow-hidden"
            >
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const active = activeSection === sec.id;
                return (
                  <motion.button
                    key={sec.id}
                    onClick={() => { setActiveSection(sec.id); setIsEditing(false); setIsEditingAddress(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left relative border-b border-[#ede9e4] last:border-0 transition-all duration-200 ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    whileHover={{ x: 2 }}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-[#f0ece7]"
                        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-primary' : 'bg-[#f0ece7]'}`}>
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#8f877d]'}`} />
                      </div>
                      <span className="text-sm font-medium">{sec.label}</span>
                    </div>
                    <ChevronRight className={`relative z-10 w-4 h-4 transition-transform ${active ? 'translate-x-0.5' : ''}`} />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              {[
                { icon: Package, label: 'View Orders', action: () => navigate('/orders') },
                { icon: Heart, label: 'Favourites', action: () => navigate('/favorites') },
              ].map((item, i) => (
                <motion.button key={i} whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-5 py-3.5 bg-white/70 backdrop-blur-lg border border-white/80 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-white/90 transition-all shadow-sm">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
              <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                onClick={() => setShowSignOutModal(true)}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-red-50/80 backdrop-blur-lg border border-red-100 rounded-xl text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </motion.button>
            </motion.div>
          </div>

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/75 backdrop-blur-lg rounded-2xl border border-white/80 shadow-sm p-8 md:p-10"
              >

                {/* ── PERSONAL ── */}
                {activeSection === 'personal' && (
                  <div className="space-y-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-400 mt-1">Manage your name and contact details</p>
                      </div>
                      {!isEditing ? (
                        <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e3dc] bg-[#faf9f7] hover:bg-[#f0ece7] text-sm font-medium text-gray-700 transition-all shadow-sm">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setDraft({
                                firstName: profile.first_name || '',
                                lastName: profile.last_name || '',
                                email: profile.email || '',
                                phone: profile.phone || '',
                              });
                              setIsEditing(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e3dc] text-sm font-medium text-gray-600 hover:bg-[#f0ece7] transition-all">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-black transition-all shadow-lg disabled:opacity-50">
                            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Changes
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label="First Name">
                        {isEditing ? (
                          <input className={inputBase} value={draft.firstName}
                            onChange={e => setDraft({ ...draft, firstName: e.target.value })} />
                        ) : (
                          <div className={inputDisabled}>{profile.first_name || '—'}</div>
                        )}
                      </FormField>
                      <FormField label="Last Name">
                        {isEditing ? (
                          <input className={inputBase} value={draft.lastName}
                            onChange={e => setDraft({ ...draft, lastName: e.target.value })} />
                        ) : (
                          <div className={inputDisabled}>{profile.last_name || '—'}</div>
                        )}
                      </FormField>
                      <FormField label="Email Address">
                        <div className={`${inputDisabled} flex items-center gap-2`}>
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {profile.email}
                        </div>
                      </FormField>
                      <FormField label="Phone Number">
                        {isEditing ? (
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input className={`${inputBase} pl-11`} type="tel" value={draft.phone}
                              onChange={e => setDraft({ ...draft, phone: e.target.value })} />
                          </div>
                        ) : (
                          <div className={`${inputDisabled} flex items-center gap-2`}>
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {profile.phone || '—'}
                          </div>
                        )}
                      </FormField>
                    </div>
                  </div>
                )}

                {/* ── ADDRESS ── */}
                {activeSection === 'address' && (
                  <div className="space-y-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl text-gray-900">Shipping Address</h2>
                        <p className="text-sm text-gray-400 mt-1">Your default delivery address</p>
                      </div>
                      {!isEditingAddress ? (
                        <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditingAddress(true)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e3dc] bg-[#faf9f7] hover:bg-[#f0ece7] text-sm font-medium text-gray-700 transition-all shadow-sm">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setAddressDraft({
                                address_line1: profile.address_line1 || '',
                                address_line2: profile.address_line2 || '',
                                city: profile.city || '',
                                province: profile.province || '',
                                zip: profile.zip || '',
                                country: profile.country || '',
                              });
                              setIsEditingAddress(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e3dc] text-sm font-medium text-gray-600 hover:bg-[#f0ece7] transition-all">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                            onClick={handleSaveAddress}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-black transition-all shadow-lg disabled:opacity-50">
                            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Address
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {isEditingAddress ? (
                      <div className="space-y-5">
                        <FormField label="Street Address">
                          <input className={inputBase} value={addressDraft.address_line1}
                            onChange={e => setAddressDraft({ ...addressDraft, address_line1: e.target.value })} placeholder="123 Main Street" />
                        </FormField>
                        <FormField label="Address Line 2">
                          <input className={inputBase} value={addressDraft.address_line2}
                            onChange={e => setAddressDraft({ ...addressDraft, address_line2: e.target.value })} placeholder="Apt, Suite, etc. (optional)" />
                        </FormField>
                        <div className="grid sm:grid-cols-3 gap-5">
                          <FormField label="City">
                            <input className={inputBase} value={addressDraft.city}
                              onChange={e => setAddressDraft({ ...addressDraft, city: e.target.value })} />
                          </FormField>
                          <FormField label="Postcode">
                            <input className={inputBase} value={addressDraft.zip}
                              onChange={e => setAddressDraft({ ...addressDraft, zip: e.target.value })} />
                          </FormField>
                          <FormField label="Country">
                            <input className={inputBase} value={addressDraft.country}
                              onChange={e => setAddressDraft({ ...addressDraft, country: e.target.value })} />
                          </FormField>
                        </div>
                      </div>
                    ) : hasAddress ? (
                      <>
                        <TiltCard intensity={0.4}>
                          <div className="bg-gradient-to-br from-[#faf9f7] to-[#f0ece7] rounded-xl p-6 border border-[#ede9e4]"
                            style={{ transformStyle: 'preserve-3d' }}>
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                                style={{ transform: 'translateZ(8px)' }}>
                                <MapPin className="w-4 h-4 text-white" />
                              </div>
                              <div style={{ transform: 'translateZ(4px)' }}>
                                <p className="font-medium text-gray-900 mb-0.5">{fullName}</p>
                                <p className="text-sm text-gray-600">{profile.address_line1}</p>
                                {profile.address_line2 && <p className="text-sm text-gray-600">{profile.address_line2}</p>}
                                <p className="text-sm text-gray-600">{profile.city}{profile.zip ? `, ${profile.zip}` : ''}</p>
                                {profile.country && (
                                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <Globe className="w-3.5 h-3.5" />{profile.country}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No address saved yet</p>
                        <p className="text-sm text-gray-400 mt-1">Click Edit to add your shipping address</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── PREFERENCES ── */}
                {activeSection === 'preferences' && (
                  <div className="space-y-7">
                    <div>
                      <h2 className="text-2xl text-gray-900">Communication Preferences</h2>
                      <p className="text-sm text-gray-400 mt-1">Choose what you'd like to hear from us</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: 'newsletter', icon: Mail, title: 'Newsletter', desc: 'New arrivals, sleep guides & seasonal collections' },
                        { key: 'orderUpdates', icon: Package, title: 'Order Updates', desc: 'Shipping notifications and delivery confirmations' },
                        { key: 'promotions', icon: Sparkles, title: 'Special Offers', desc: 'Exclusive discounts and member-only promotions' },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        const checked = preferences[item.key];
                        return (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`relative flex items-center gap-5 p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${checked ? 'border-[#c4bbb1] bg-[#faf9f7]' : 'border-[#ede9e4] bg-white/50 hover:border-[#d8d1c8]'}`}
                            onClick={() => setPreferences({ ...preferences, [item.key]: !checked })}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-primary' : 'bg-[#f0ece7]'}`}>
                              <Icon className={`w-4 h-4 ${checked ? 'text-white' : 'text-[#8f877d]'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle checked={checked} onChange={(v) => setPreferences({ ...preferences, [item.key]: v })} />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── SECURITY ── */}
                {activeSection === 'security' && (
                  <div className="space-y-7">
                    <div>
                      <h2 className="text-2xl text-gray-900">Security</h2>
                      <p className="text-sm text-gray-400 mt-1">Manage your password and account security</p>
                    </div>

                    <AnimatePresence mode="wait">
                      {!showPwForm ? (
                        <motion.button
                          key="btn"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}
                          onClick={() => setShowPwForm(true)}
                          className="w-full flex items-center gap-4 p-5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl hover:border-gray-400 hover:bg-[#f0ece7] transition-all shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#ece8e2] flex items-center justify-center">
                            <Lock className="w-4 h-4 text-[#8f877d]" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">Change Password</p>
                            <p className="text-xs text-gray-500">Update your account password</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          onSubmit={handlePasswordChange}
                          className="space-y-5 bg-[#faf9f7] rounded-xl border border-[#e8e3dc] p-6"
                        >
                          <h3 className="text-base text-gray-900">Update Password</h3>
                          {[
                            { key: 'new', label: 'New Password', placeholder: '••••••••' },
                            { key: 'confirm', label: 'Confirm New Password', placeholder: '••••••••' },
                          ].map((field) => (
                            <FormField key={field.key} label={field.label}>
                              <div className="relative">
                                <input
                                  type={showPw[field.key] ? 'text' : 'password'}
                                  value={pw[field.key]}
                                  onChange={e => setPw({ ...pw, [field.key]: e.target.value })}
                                  placeholder={field.placeholder}
                                  className={`${inputBase} pr-12`}
                                />
                                <button type="button" onClick={() => setShowPw({ ...showPw, [field.key]: !showPw[field.key] })}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                  {showPw[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </FormField>
                          ))}
                          <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowPwForm(false)}
                              className="flex-1 py-3 rounded-xl border border-[#e8e3dc] text-sm font-medium text-gray-600 hover:bg-[#f0ece7] transition-all">
                              Cancel
                            </button>
                            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                              className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-all shadow-lg">
                              Update Password
                            </motion.button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignOutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">Sign Out</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                You will need to sign in again to access your account and order history.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors shadow-lg"
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
