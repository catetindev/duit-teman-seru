
import { motion } from 'framer-motion';

interface PricingHeadingProps {
  title: string;
  description: string;
}

const PricingHeading = ({ title, description }: PricingHeadingProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl md:text-4xl font-outfit font-bold mb-4">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
        {description}
      </p>
    </motion.div>
  );
};

export default PricingHeading;
