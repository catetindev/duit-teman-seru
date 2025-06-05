
import React from 'react';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Home, Users, TrendingUp, MessageSquare, Settings } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    {
      name: "Beranda",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Fitur",
      link: "#features",
      icon: <TrendingUp className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Testimoni",
      link: "#testimonials",
      icon: <Users className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Feedback",
      link: "/feedback",
      icon: <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return <FloatingNav navItems={navItems} />;
};

export default Navbar;
