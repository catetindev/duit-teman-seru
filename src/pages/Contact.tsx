import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

const Contact = () => {
  const { t } = useLanguage(); // Use the language hook
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error(t('contact.toast.fillFields'));
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success(t('contact.toast.sentSuccess'));
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {t('contact.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {t('contact.subtitle')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{t('contact.emailUs')}</h2>
                <a href="mailto:hello@catatyo.com" className="text-[#28e57d] text-lg hover:underline">
                  hello@catatyo.com
                </a>
              </div>
              
              <div className="bg-gray-200 rounded-xl h-64 md:h-80 flex items-center justify-center text-gray-500">
                {t('contact.illustrationAlt')}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.name')}
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('contact.form.namePlaceholder')}
                      className="h-12 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className="h-12 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.form.message')}
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('contact.form.messagePlaceholder')}
                      className="min-h-32 rounded-lg"
                    />
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium transition-all"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
                          {t('contact.form.sending')}
                        </span>
                      ) : (
                        t('contact.form.send')
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;