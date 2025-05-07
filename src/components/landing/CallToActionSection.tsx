import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
const CallToActionSection = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const goToPricing = () => navigate('/pricing');
  return;
};
export default CallToActionSection;