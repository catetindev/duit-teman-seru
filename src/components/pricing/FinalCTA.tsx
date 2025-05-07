
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="text-center mt-12"
    >
      <p className="text-lg text-gray-600 mb-4">Belum yakin? Cobain aja yang Gratis dulu~</p>
      <Button 
        onClick={goToSignup} 
        variant="outline" 
        className="border-[#28e57d] text-[#28e57d] hover:bg-[#28e57d]/5 hover:border-[#28e57d] transition-all rounded-lg"
      >
        Daftar Akun Gratis
      </Button>
    </motion.div>
  );
};

export default FinalCTA;
