
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import PageHeader from '@/components/pricing/PageHeader';
import PricingHeader from '@/components/pricing/PricingHeader';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCards from '@/components/pricing/PricingCards';
import PricingCTA from '@/components/pricing/PricingCTA';
import PageFooter from '@/components/pricing/PageFooter';

const Pricing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      
      {/* Pricing section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <PricingHeader />
          <BillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
          <PricingCards billingCycle={billingCycle} goToSignup={goToSignup} />
          <PricingCTA goToSignup={goToSignup} />
        </div>
      </section>
      
      <PageFooter />
    </div>
  );
};

export default Pricing;
