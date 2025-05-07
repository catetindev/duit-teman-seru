
import FreePlan from './FreePlan';
import PremiumPlan from './PremiumPlan';

interface PricingPlansProps {
  billingCycle: 'monthly' | 'yearly';
}

const PricingPlans = ({ billingCycle }: PricingPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <FreePlan />
      <PremiumPlan billingCycle={billingCycle} />
    </div>
  );
};

export default PricingPlans;
