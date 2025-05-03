
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GoalsCollaborationDocs = () => {
  const { isPremium } = useAuth();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="max-w-3xl mx-auto">
        <Link to="/goals">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Goals
          </Button>
        </Link>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Goal Collaboration Documentation</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The Goal Collaboration feature allows you to share your savings goals with other users, 
                enabling you to work together towards shared financial objectives. This can be useful for 
                family savings, group trips, or any situation where multiple people want to track progress 
                towards a common financial goal.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Inviting Collaborators</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  To invite a collaborator to your savings goal, follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Navigate to the Goals page</li>
                  <li>Find the goal you want to share and click on the collaborators icon (people icon)</li>
                  <li>In the dialog that appears, enter the email address of the person you want to invite</li>
                  <li>Click the "Invite" button to send the invitation</li>
                </ol>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> The person you invite must have an account in the application. 
                    If they don't have an account yet, they'll need to register before they can collaborate on your goal.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Collaborator Permissions</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                When you invite someone to collaborate on your goal, they will have the following permissions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>View the goal's details (title, target amount, current saved amount, etc.)</li>
                <li>Track the progress of the goal</li>
                <li>Add contributions to the saved amount</li>
                <li>View other collaborators on the goal</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                However, collaborators <strong>cannot</strong> perform the following actions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Delete the goal (only the goal owner can do this)</li>
                <li>Remove other collaborators (only the goal owner can do this)</li>
                <li>Change the goal's target amount or title (only the goal owner can do this)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Managing Collaborators</h2>
              <p className="text-gray-700 dark:text-gray-300">
                As the goal owner, you can manage the collaborators on your goal at any time:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>To view all collaborators, click on the collaborators icon (people icon) on your goal</li>
                <li>To remove a collaborator, click on the trash icon next to their name in the collaborators list</li>
                <li>To add more collaborators, use the invitation form at the top of the collaborators dialog</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Best Practices</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Only invite people you trust to collaborate on your financial goals</li>
                <li>Communicate with your collaborators outside the app to coordinate contributions</li>
                <li>Regularly check the goal's progress to ensure everyone is contributing as expected</li>
                <li>Consider setting up a schedule for contributions to keep the goal on track</li>
                <li>Celebrate milestones together when you reach certain percentages of your target</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoalsCollaborationDocs;
