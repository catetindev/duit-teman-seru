
import FreePlanCard from './FreePlanCard';
import PremiumPlanCard from './PremiumPlanCard';

interface PricingCardsProps {
  billingCycle: 'monthly' | 'yearly';
  goToSignup: () => void;
}

const PricingCards = ({ billingCycle, goToSignup }: PricingCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <FreePlanCard goToSignup={goToSignup} />
      <PremiumPlanCard billingCycle={billingCycle} />
    </div>
  );
};

export default PricingCards;
