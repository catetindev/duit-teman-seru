
import { useState } from 'react';
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingHeading from '@/components/pricing/PricingHeading';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingPlans from '@/components/pricing/PricingPlans';
import FinalCTA from '@/components/pricing/FinalCTA';
import PricingFooter from '@/components/pricing/PricingFooter';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <div className="min-h-screen bg-white">
      <PricingHeader />
      
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <PricingHeading 
            title="Duit makin teratur, hidup makin terarah."
            description="Pilih yang cocok buat kamu — mau yang free-free aja, atau upgrade dikit buat hidup lebih rapi."
          />
          
          <BillingToggle 
            billingCycle={billingCycle}
            setBillingCycle={(cycle) => setBillingCycle(cycle)}
          />
          
          <PricingPlans billingCycle={billingCycle} />
          
          <FinalCTA />
        </div>
      </section>
      
      <PricingFooter />
    </div>
  );
};

export default Pricing;
