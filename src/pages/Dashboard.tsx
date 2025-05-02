import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/ui/StatCard';
import GoalCard from '@/components/ui/GoalCard';
import TransactionList from '@/components/ui/TransactionList';
import ExpenseCard from '@/components/ui/ExpenseCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, CreditCard, PiggyBank, Target, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { type } = useParams();
  const isPremium = type === 'premium';
  const { t } = useLanguage();

  // Mock data
  const mockTransactions = [
    {
      id: '1',
      type: 'expense' as const,
      amount: 125000,
      currency: 'IDR' as const,
      category: 'food',
      description: 'Lunch at Warung Pak Made',
      date: '2025-05-01',
      icon: '🍲'
    },
    {
      id: '2',
      type: 'expense' as const,
      amount: 55000,
      currency: 'IDR' as const,
      category: 'transport',
      description: 'Gojek ride',
      date: '2025-05-01',
      icon: '🛵'
    },
    {
      id: '3',
      type: 'income' as const,
      amount: 5000000,
      currency: 'IDR' as const,
      category: 'salary',
      description: 'Monthly Salary',
      date: '2025-05-01',
      icon: '💰'
    }
  ];

  const mockGoals = [
    {
      name: 'New Laptop',
      target: 15000000,
      current: 7500000,
      currency: 'IDR' as const,
      deadline: 'Sep 2025',
      emoji: '💻'
    }
  ];

  // Premium users get more goals
  const premiumGoals = [
    ...mockGoals,
    {
      name: 'Bali Trip',
      target: 8000000,
      current: 3200000,
      currency: 'IDR' as const,
      deadline: 'Dec 2025',
      emoji: '🏝️'
    },
    {
      name: 'Emergency Fund',
      target: 25000000,
      current: 10000000,
      currency: 'IDR' as const,
      deadline: 'Ongoing',
      emoji: '🚨'
    }
  ];

  const mockBudgets = [
    {
      category: 'Food',
      spent: 1250000,
      budget: 2000000,
      currency: 'IDR' as const
    },
    {
      category: 'Transport',
      spent: 450000,
      budget: 500000,
      currency: 'IDR' as const
    },
    {
      category: 'Entertainment',
      spent: 800000,
      budget: 600000,
      currency: 'IDR' as const
    }
  ];

  const mockBadges = isPremium ? [
    {
      name: 'Saver Starter',
      description: 'Save your first Rp100,000',
      icon: '🌱',
      isLocked: false
    },
    {
      name: 'Budget Master',
      description: 'Stay under budget for 3 months',
      icon: '🏆',
      isLocked: false,
      isNew: true
    },
    {
      name: 'Money Explorer',
      description: 'Track expenses for 30 days straight',
      icon: '🧭',
      isLocked: false
    },
    {
      name: 'Goal Crusher',
      description: 'Complete your first savings goal',
      icon: '🎯',
      isLocked: true
    }
  ] : [];

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground">
          {isPremium 
            ? 'Your money is looking great today! 💎' 
            : 'How are we spending today? 💸'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title={t('dashboard.balance')}
          value="Rp4,250,000"
          icon={<PiggyBank size={20} className="text-teal-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title={t('dashboard.income')}
          value="Rp5,000,000"
          icon={<CreditCard size={20} className="text-purple-500" />}
          variant="purple"
        />
        <StatCard 
          title={t('dashboard.expense')}
          value="Rp750,000"
          icon={<CreditCard size={20} className="text-orange-500" />}
          variant="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('transactions.title')}</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle size={16} />
                <span>{t('transactions.add')}</span>
              </Button>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
                <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <TransactionList transactions={mockTransactions} />
              </TabsContent>
              <TabsContent value="income">
                <TransactionList 
                  transactions={mockTransactions.filter(t => t.type === 'income')} 
                />
              </TabsContent>
              <TabsContent value="expense">
                <TransactionList 
                  transactions={mockTransactions.filter(t => t.type === 'expense')} 
                />
              </TabsContent>
            </Tabs>
            
            <Button variant="ghost" size="sm" className="w-full mt-4">
              View all transactions
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
          
          {isPremium && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('budget.title')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBudgets.map((budget, index) => (
                  <ExpenseCard 
                    key={index}
                    category={budget.category}
                    spent={budget.spent}
                    budget={budget.budget}
                    currency={budget.currency}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('goals.title')}</h2>
              {isPremium && (
                <Button variant="outline" size="sm" className="gap-1">
                  <PlusCircle size={16} />
                  <span>{t('goals.add')}</span>
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {(isPremium ? premiumGoals : mockGoals).map((goal, index) => (
                <GoalCard
                  key={index}
                  name={goal.name}
                  target={goal.target}
                  current={goal.current}
                  currency={goal.currency}
                  deadline={goal.deadline}
                  emoji={goal.emoji}
                />
              ))}
              
              {!isPremium && (
                <div className="bg-muted/50 rounded-xl p-4 mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upgrade to premium for unlimited savings goals! ✨
                  </p>
                  <Button size="sm" className="gradient-bg-purple">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {isPremium && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Your Badges</h2>
              <div className="grid grid-cols-2 gap-3">
                {mockBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    isLocked={badge.isLocked}
                    isNew={badge.isNew}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
