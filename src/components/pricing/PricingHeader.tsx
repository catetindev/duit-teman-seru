
import { motion } from 'framer-motion';

const PricingHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl md:text-4xl font-outfit font-bold mb-4">
        Duit makin teratur, hidup makin terarah.
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
        Pilih yang cocok buat kamu — mau yang free-free aja, atau upgrade dikit buat hidup lebih rapi.
      </p>
    </motion.div>
  );
};

export default PricingHeader;
