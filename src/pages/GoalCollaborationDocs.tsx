
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Users, UserPlus, Trash2, PenLine } from 'lucide-react';

const GoalCollaborationDocs = () => {
  const { isPremium } = useAuth();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Goal Collaboration Documentation</h1>
        <p className="text-muted-foreground mt-1">Learn how to use the goal collaboration feature</p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Goal collaboration allows you to share your financial goals with others, enabling teams,
              families, or friends to work together toward common financial objectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-muted p-4 rounded-md">
              <div className="flex-1 border-b sm:border-b-0 sm:border-r border-border pb-2 sm:pb-0 sm:pr-4">
                <h3 className="font-medium mb-1">Shared Access</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple users can view and contribute to the same savings goal
                </p>
              </div>
              <div className="flex-1 border-b sm:border-b-0 sm:border-r border-border py-2 sm:py-0 sm:px-4">
                <h3 className="font-medium mb-1">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Changes made by collaborators are visible to everyone
                </p>
              </div>
              <div className="flex-1 pt-2 sm:pt-0 sm:pl-4">
                <h3 className="font-medium mb-1">Team Accountability</h3>
                <p className="text-sm text-muted-foreground">
                  Work together to reach your financial goals faster
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How To Invite Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              How to Invite Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Navigate to your Goals page</strong> - Access your goals list from the main dashboard.
              </li>
              <li>
                <strong>Find the Goal</strong> - Locate the goal you want to share with others.
              </li>
              <li>
                <strong>Open the Collaborators Dialog</strong> - Click the <Users className="h-4 w-4 inline" /> icon in the goal card.
              </li>
              <li>
                <strong>Invite by Email</strong> - Enter the email address of the person you want to invite and click "Invite".
                <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                  <AlertCircle className="h-4 w-4 inline mr-1 text-amber-500" />
                  <span>The invited user must have an account in the system with this exact email address.</span>
                </div>
              </li>
              <li>
                <strong>Manage Collaborators</strong> - View and remove collaborators from the same dialog.
              </li>
            </ol>
            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2">Example</h4>
              <p className="text-sm">
                If you're saving for a vacation with friends, invite each person by their email address.
                They'll be able to view the goal and track progress together.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collaborator Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              Collaborator Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Action</th>
                    <th className="text-left py-2">Goal Owner</th>
                    <th className="text-left py-2">Collaborator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">View goal details</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Edit goal details</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Update saved amount</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Invite new collaborators</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Remove collaborators</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">✅</td>
                  </tr>
                  <tr>
                    <td className="py-2">Delete the goal</td>
                    <td className="py-2">✅</td>
                    <td className="py-2">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Important Notes:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
                  <p className="text-sm">Collaborators have almost the same permissions as goal owners, except they cannot delete the goal.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
                  <p className="text-sm">All changes made by collaborators are visible to all other collaborators and the goal owner.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
                  <p className="text-sm">There is no limit to the number of collaborators you can add to a goal.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Removing Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you need to remove someone's access to a goal, you can easily do so from the collaborators dialog:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Open the Collaborators Dialog</strong> - Click the <Users className="h-4 w-4 inline" /> icon for the goal.
              </li>
              <li>
                <strong>Find the Collaborator</strong> - Locate the person you want to remove in the list.
              </li>
              <li>
                <strong>Remove Access</strong> - Click the <Trash2 className="h-4 w-4 inline text-red-500" /> icon next to their name.
              </li>
              <li>
                <strong>Confirmation</strong> - The collaborator is immediately removed, and they will no longer have access to the goal.
              </li>
            </ol>
            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2">After Removal</h4>
              <p className="text-sm">
                Once removed, a collaborator will no longer see the goal in their goals list.
                They will need to be invited again to regain access.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                <div>
                  <strong>Clear Communication</strong>
                  <p className="text-sm text-muted-foreground">
                    Establish clear expectations about contributions and updates with your collaborators.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                <div>
                  <strong>Regular Updates</strong>
                  <p className="text-sm text-muted-foreground">
                    Update the saved amount frequently to keep everyone motivated and informed.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                <div>
                  <strong>Celebrate Milestones</strong>
                  <p className="text-sm text-muted-foreground">
                    Acknowledge progress milestones to keep everyone engaged in the goal.
                  </p>
                </div>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                <div>
                  <strong>Verify Emails</strong>
                  <p className="text-sm text-muted-foreground">
                    Double-check email addresses when inviting collaborators to ensure you're inviting the right person.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GoalCollaborationDocs;
