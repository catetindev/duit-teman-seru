
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BillingToggle from '@/components/pricing/BillingToggle';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleGoToPremium = () => {
    window.location.href = 'https://catatyo.myr.id/membership/premium-user';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl p-0 overflow-hidden bg-white">
        <DialogHeader className="pt-6 px-6 mb-0 pb-0">
          <DialogTitle className="text-2xl font-bold">Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Dapatkan fitur Catatyo yang lengkap dan mulai kelola keuangan dengan lebih baik
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          <BillingToggle 
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-xl font-semibold mb-2">Gratis</h3>
              <p className="text-2xl font-bold mb-4">Rp0</p>
              <ul className="space-y-2 mb-5">
                <li className="flex gap-2">
                  <Check size={18} className="text-gray-500" />
                  <span className="text-sm">Catat pengeluaran</span>
                </li>
                <li className="flex gap-2">
                  <Check size={18} className="text-gray-500" />
                  <span className="text-sm">Lihat ringkasan laporan</span>
                </li>
                <li className="flex gap-2">
                  <Check size={18} className="text-gray-500" />
                  <span className="text-sm">1 tabungan goal</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Plan Aktif
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="border-2 border-[#28e57d] rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-semibold">Premium</h3>
                <span className="bg-[#28e57d]/10 text-[#28e57d] text-xs px-2 py-1 rounded-full font-medium">RECOMMENDED</span>
              </div>
              <p className="text-2xl font-bold mb-1">
                {billingCycle === 'monthly' ? 'Rp29K' : 'Rp290K'}
                <span className="text-sm font-normal text-gray-500">/{billingCycle === 'monthly' ? 'bln' : 'thn'}</span>
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-[#28e57d] mb-4">Hemat 20% dengan berlangganan tahunan</p>
              )}
              <ul className="space-y-2 mb-5">
                <li className="flex gap-2">
                  <Check size={18} className="text-[#28e57d]" />
                  <span className="text-sm">Semua fitur Gratis</span>
                </li>
                <li className="flex gap-2">
                  <Check size={18} className="text-[#28e57d]" />
                  <span className="text-sm">Unlimited saving goals</span>
                </li>
                <li className="flex gap-2">
                  <Check size={18} className="text-[#28e57d]" />
                  <span className="text-sm">Laporan detail & grafik</span>
                </li>
                <li className="flex gap-2">
                  <Check size={18} className="text-[#28e57d]" />
                  <span className="text-sm">Entrepreneur mode</span>
                </li>
              </ul>
              <Button 
                onClick={handleGoToPremium} 
                className="w-full bg-[#28e57d] hover:bg-[#28e57d]/90"
              >
                <span className="flex items-center gap-2">
                  Upgrade Sekarang
                  <ArrowRight size={16} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
