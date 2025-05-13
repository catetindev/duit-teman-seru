import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast as sonnerToast } from '@/components/ui/sonner'; // Renamed to avoid conflict
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

// Form schema
const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

const currencyFormSchema = z.object({
  currency: z.string().min(1, 'Please select a currency'),
  language: z.string().min(1, 'Please select a language'),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type CurrencyFormValues = z.infer<typeof currencyFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SettingsPage = () => {
  const { user, profile, logout, isPremium, isAdmin } = useAuth();
  const { toast: uiToast } = useToast(); // Shadcn toast
  const { t } = useLanguage(); // Language hook
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
    },
    mode: "onChange",
  });

  const currencyForm = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      currency: 'IDR',
      language: 'id', // Default to Indonesian
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user && profile) {
      profileForm.setValue('full_name', profile.full_name || '');
      profileForm.setValue('email', user.email || '');
    }
    
    const loadUserSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error; // Ignore "No rows found"
        
        if (data) {
          currencyForm.setValue('currency', data.preferred_currency);
          currencyForm.setValue('language', data.preferred_language);
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      }
    };
    
    loadUserSettings();
  }, [user, profile, profileForm, currencyForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      uiToast({
        title: t('settings.toast.profileUpdatedTitle'),
        description: t('settings.toast.profileUpdatedDesc'),
      });
    } catch (error: any) {
      uiToast({
        title: t('settings.toast.profileErrorTitle'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onCurrencySubmit = async (data: CurrencyFormValues) => {
    if (!user) return;
    
    try {
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingSettings) {
        const { error } = await supabase
          .from('user_settings')
          .update({
            preferred_currency: data.currency,
            preferred_language: data.language,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            preferred_currency: data.currency,
            preferred_language: data.language,
          });
          
        if (error) throw error;
      }
      
      uiToast({
        title: t('settings.toast.prefsUpdatedTitle'),
        description: t('settings.toast.prefsUpdatedDesc'),
      });
      
      if (data.language !== currencyForm.getValues().language) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error: any) {
      uiToast({
        title: t('settings.toast.prefsErrorTitle'),
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      uiToast({
        title: t('settings.toast.passwordUpdatedTitle'),
        description: t('settings.toast.passwordUpdatedDesc'),
      });
      
      passwordForm.reset();
    } catch (error: any) {
      uiToast({
        title: t('settings.toast.passwordErrorTitle'),
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      await logout();
      sonnerToast(t('settings.toast.accountDeletedTitle'), {
        description: t('settings.toast.accountDeletedDesc')
      });
    } catch (error: any) {
      uiToast({
        title: t('settings.toast.accountDeleteErrorTitle'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <DashboardLayout isPremium={isPremium} isAdmin={isAdmin}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">{t('settings.pageTitle')}</h1>
        <p className="text-muted-foreground">{t('settings.pageSubtitle')}</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/60 rounded-full p-1 mb-2">
          <TabsTrigger value="profile" className="rounded-full">
            {t('settings.tab.profile')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-full">
            {t('settings.tab.preferences')}
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-full">
            {t('settings.tab.password')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-none shadow-md rounded-xl">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle>{t('settings.profile.title')}</CardTitle>
              <CardDescription>
                {t('settings.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.fullName')}</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="rounded-full bg-muted" />
                        </FormControl>
                        <FormDescription>
                          {t('settings.profile.emailDesc')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                  >
                    {t('settings.profile.saveButton')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="border-none shadow-md rounded-xl">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle>{t('settings.preferences.title')}</CardTitle>
              <CardDescription>
                {t('settings.preferences.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...currencyForm}>
                <form onSubmit={currencyForm.handleSubmit(onCurrencySubmit)} className="space-y-6">
                  <FormField
                    control={currencyForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings.preferences.currency')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-full">
                              <SelectValue placeholder={t('settings.preferences.selectCurrency')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IDR">IDR - Rupiah Indonesia</SelectItem>
                            <SelectItem value="USD">USD - Dolar Amerika Serikat</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - Pound Inggris</SelectItem>
                            <SelectItem value="SGD">SGD - Dolar Singapura</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={currencyForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings.preferences.language')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-full">
                              <SelectValue placeholder={t('settings.preferences.selectLanguage')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                  >
                    {t('settings.preferences.saveButton')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="border-none shadow-md rounded-xl">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle>{t('settings.security.title')}</CardTitle>
              <CardDescription>
                {t('settings.security.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings.security.currentPassword')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field}
                            className="rounded-full" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings.security.newPassword')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="rounded-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('settings.security.confirmNewPassword')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="rounded-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                  >
                    {t('settings.security.changePasswordButton')}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <h3 className="text-lg font-semibold text-red-600 mb-2">{t('settings.dangerZone.title')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('settings.dangerZone.desc')}
              </p>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-full">{t('settings.dangerZone.deleteButton')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.deleteDialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('settings.deleteDialog.desc')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 rounded-full"
                      onClick={handleDeleteAccount}
                    >
                      {t('common.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;