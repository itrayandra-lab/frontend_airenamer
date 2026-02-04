import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Phone, 
  Building, 
  MapPin, 
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { apiPost, apiPut } from '@/config/api';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  bio?: string;
  billing_address?: string;
  billing_city?: string;
  billing_postal_code?: string;
  billing_full_name?: string;
  billing_email?: string;
  billing_phone?: string;
  profile_completed: boolean;
}

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onProfileUpdated: (updatedUser: UserData) => void;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    bio: '',
    billing_address: '',
    billing_city: '',
    billing_postal_code: '',
    billing_full_name: '',
    billing_email: '',
    billing_phone: ''
  });

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        company_name: user.company_name || '',
        bio: user.bio || '',
        billing_address: user.billing_address || '',
        billing_city: user.billing_city || '',
        billing_postal_code: user.billing_postal_code || '',
        billing_full_name: user.billing_full_name || `${user.first_name} ${user.last_name}`.trim(),
        billing_email: user.billing_email || user.email,
        billing_phone: user.billing_phone || user.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      setError('Nama depan wajib diisi');
      return false;
    }
    
    if (!formData.last_name.trim()) {
      setError('Nama belakang wajib diisi');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Nomor telepon wajib diisi');
      return false;
    }
    
    if (!formData.billing_address.trim()) {
      setError('Alamat penagihan wajib diisi');
      return false;
    }
    
    if (!formData.billing_city.trim()) {
      setError('Kota wajib diisi');
      return false;
    }
    
    if (!formData.billing_postal_code.trim()) {
      setError('Kode pos wajib diisi');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiPut('/user/profile', {
        ...formData,
        profile_completed: true
      });

      if (result.success) {
        setSuccess('Profile berhasil dilengkapi!');
        
        // Update user data in parent component
        const updatedUser = { ...user, ...formData, profile_completed: true };
        onProfileUpdated(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message || 'Gagal memperbarui profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      formData.first_name,
      formData.last_name,
      formData.phone,
      formData.billing_address,
      formData.billing_city,
      formData.billing_postal_code
    ];
    
    const filledFields = fields.filter(field => field.trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            Lengkapi Profile Anda
          </DialogTitle>
          <DialogDescription>
            Lengkapi informasi profile untuk mendapatkan pengalaman terbaik dari layanan kami.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress Kelengkapan</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Informasi Pribadi
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nama Depan *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="John"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nama Belakang *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Doe"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Nama Perusahaan (Opsional)</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="PT. Contoh Indonesia"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Opsional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Ceritakan sedikit tentang diri Anda..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Alamat Penagihan
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="billing_address">Alamat Lengkap *</Label>
              <Input
                id="billing_address"
                value={formData.billing_address}
                onChange={(e) => handleInputChange('billing_address', e.target.value)}
                placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing_city">Kota *</Label>
                <Input
                  id="billing_city"
                  value={formData.billing_city}
                  onChange={(e) => handleInputChange('billing_city', e.target.value)}
                  placeholder="Jakarta"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_postal_code">Kode Pos *</Label>
                <Input
                  id="billing_postal_code"
                  value={formData.billing_postal_code}
                  onChange={(e) => handleInputChange('billing_postal_code', e.target.value)}
                  placeholder="12345"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_full_name">Nama Lengkap untuk Penagihan</Label>
              <Input
                id="billing_full_name"
                value={formData.billing_full_name}
                onChange={(e) => handleInputChange('billing_full_name', e.target.value)}
                placeholder="Nama sesuai identitas"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_email">Email untuk Penagihan</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="billing_email"
                  type="email"
                  value={formData.billing_email}
                  onChange={(e) => handleInputChange('billing_email', e.target.value)}
                  placeholder="billing@email.com"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_phone">Telepon untuk Penagihan</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="billing_phone"
                  value={formData.billing_phone}
                  onChange={(e) => handleInputChange('billing_phone', e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Nanti Saja
            </Button>
            <Button
              type="submit"
              disabled={loading || completionPercentage < 100}
              className="flex-1 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Simpan Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;