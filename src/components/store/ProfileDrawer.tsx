import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Check, Lock, Bell, CreditCard, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'address' | 'preferences' | 'security'>('personal');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isMobile = useIsMobile();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'Alex',
    lastName: 'Remsleep',
    email: 'alex@example.com',
    phone: '+44 20 7123 4567',
    address: {
      street: '123 Sleep Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    preferences: {
      newsletter: true,
      orderUpdates: true,
      promotions: false
    }
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const menuItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={`bg-[#f2e9dc] p-0 gap-0 border-zinc-200 h-full flex flex-col overflow-hidden ${
          isMobile ? "w-full border-l shadow-2xl" : "w-full sm:max-w-4xl border-l"
        }`}
      >
        <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-6 py-6 border-b border-[#e0dbd5] bg-[#f2e9dc]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-bold tracking-[0.2em] uppercase text-gray-900">
              Profile Settings
            </SheetTitle>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Changes saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-80 lg:border-r lg:border-[#e0dbd5] lg:sticky lg:top-0 h-fit">
              <nav className="p-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F8F5F2] transition-colors rounded-lg ${
                        activeSection === item.id ? 'bg-[#F8F5F2] text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="p-6 space-y-3 border-t border-[#e0dbd5]">
                <Button variant="outline" className="w-full justify-start gap-2 border-[#e0dbd5] hover:bg-[#F8F5F2]">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">View Orders</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-[#e0dbd5] hover:bg-[#F8F5F2]">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Favorites</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-red-200 hover:bg-red-50 text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Personal Information</h2>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="gap-2 border-[#e0dbd5] hover:bg-[#F8F5F2]"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="gap-2 border-[#e0dbd5] hover:bg-[#F8F5F2]"
                        >
                          <X className="h-4 w-4" />
                          <span className="text-sm font-medium">Cancel</span>
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="gap-2 bg-[#2D2D2D] hover:bg-black"
                        >
                          <Save className="h-4 w-4" />
                          <span className="text-sm font-medium">Save</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input
                        type="text"
                        value={isEditing ? editedProfile.firstName : profile.firstName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white border-[#e0dbd5] focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input
                        type="text"
                        value={isEditing ? editedProfile.lastName : profile.lastName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white border-[#e0dbd5] focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={isEditing ? editedProfile.email : profile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white border-[#e0dbd5] focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={isEditing ? editedProfile.phone : profile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="bg-white border-[#e0dbd5] focus:border-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {activeSection === 'address' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Address</h2>
                    <Button variant="outline" className="gap-2 border-[#e0dbd5] hover:bg-[#F8F5F2]">
                      <Edit2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <Input
                        type="text"
                        value={profile.address.street}
                        disabled
                        className="bg-gray-50 text-gray-500 border-[#e0dbd5]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <Input
                          type="text"
                          value={profile.address.city}
                          disabled
                          className="bg-gray-50 text-gray-500 border-[#e0dbd5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                        <Input
                          type="text"
                          value={profile.address.postcode}
                          disabled
                          className="bg-gray-50 text-gray-500 border-[#e0dbd5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <Input
                          type="text"
                          value={profile.address.country}
                          disabled
                          className="bg-gray-50 text-gray-500 border-[#e0dbd5]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Communication Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-[#e0dbd5] rounded-lg cursor-pointer hover:bg-[#F8F5F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Newsletter</div>
                          <div className="text-sm text-gray-600">Receive updates about new products and sleep tips</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.newsletter}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, newsletter: e.target.checked }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-[#e0dbd5] rounded-lg cursor-pointer hover:bg-[#F8F5F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Order Updates</div>
                          <div className="text-sm text-gray-600">Get notifications about your order status and shipping</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.orderUpdates}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, orderUpdates: e.target.checked }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 border border-[#e0dbd5] rounded-lg cursor-pointer hover:bg-[#F8F5F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Promotions</div>
                          <div className="text-sm text-gray-600">Receive special offers and discount codes</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.preferences.promotions}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, promotions: e.target.checked }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-serif text-gray-900">Security Settings</h2>
                  </div>

                  {!showPasswordForm ? (
                    <Button
                      onClick={() => setShowPasswordForm(true)}
                      variant="outline"
                      className="w-full justify-start gap-3 p-4 h-auto border-[#e0dbd5] hover:bg-[#F8F5F2]"
                    >
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Change Password</div>
                        <div className="text-sm text-gray-600">Update your account password</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
                    </Button>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="bg-white border-[#e0dbd5] focus:border-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="bg-white border-[#e0dbd5] focus:border-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="bg-white border-[#e0dbd5] focus:border-gray-900"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          variant="outline"
                          className="flex-1 border-[#e0dbd5] hover:bg-[#F8F5F2]"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-[#2D2D2D] hover:bg-black"
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
