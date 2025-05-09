
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BillingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void;
}

const BillingToggle = ({ billingCycle, setBillingCycle }: BillingToggleProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex justify-center mb-10"
    >
      <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-full">
        <Label htmlFor="billing-toggle" 
          className={`text-sm px-4 py-2 rounded-full cursor-pointer ${billingCycle === 'monthly' ? 'bg-white shadow-sm font-medium' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </Label>
        
        <Switch
          id="billing-toggle"
          checked={billingCycle === 'yearly'}
          onCheckedChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="data-[state=checked]:bg-[#28e57d]"
        />
        
        <Label htmlFor="billing-toggle" 
          className={`text-sm px-4 py-2 rounded-full cursor-pointer ${billingCycle === 'yearly' ? 'bg-white shadow-sm font-medium' : ''}`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly <span className="text-[#28e57d] text-xs font-medium">Save 20%</span>
        </Label>
      </div>
    </motion.div>
  );
};

export default BillingToggle;
