
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import StatCard from '@/components/ui/StatCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Users, UserCheck, Award, Bell } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const { t } = useLanguage();
  
  // Mock user data
  const mockUsers = [
    { 
      id: '1', 
      name: 'Budi Santoso', 
      email: 'budi@example.com', 
      status: 'active', 
      isPremium: true,
      joined: '2025-04-22',
      lastActive: '2025-05-02'
    },
    { 
      id: '2', 
      name: 'Dewi Putri', 
      email: 'dewi@example.com', 
      status: 'inactive', 
      isPremium: false,
      joined: '2025-03-15',
      lastActive: '2025-04-25'
    },
    { 
      id: '3', 
      name: 'Adi Nugroho', 
      email: 'adi@example.com', 
      status: 'active', 
      isPremium: true,
      joined: '2025-04-30',
      lastActive: '2025-05-01'
    },
    { 
      id: '4', 
      name: 'Siti Rahayu', 
      email: 'siti@example.com', 
      status: 'active', 
      isPremium: false,
      joined: '2025-02-18',
      lastActive: '2025-05-02'
    }
  ];
  
  return (
    <DashboardLayout isAdmin>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, content, and system settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title={t('admin.users')}
          value="2,458"
          icon={<Users size={20} />}
        />
        <StatCard 
          title={t('admin.premium')}
          value="583"
          icon={<UserCheck size={20} className="text-purple-500" />}
          trend={{ value: 8.5, isPositive: true }}
          variant="purple"
        />
        <StatCard 
          title={t('admin.free')}
          value="1,875"
          icon={<Users size={20} className="text-teal-500" />}
          trend={{ value: 12, isPositive: true }}
          variant="teal"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <Input 
                    type="search" 
                    placeholder="Search users..." 
                    className="pl-8 w-64"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    🔍
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button size="sm">Add User</Button>
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="free">Free Users</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span 
                                className={`w-2 h-2 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <span>{user.status}</span>
                              {user.isPremium && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="premium">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers
                        .filter(user => user.isPremium)
                        .map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span 
                                className={`w-2 h-2 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <span>{user.status}</span>
                              {user.isPremium && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>1-4</strong> of <strong>4</strong> users
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Segment</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Users</option>
                    <option>Premium Users</option>
                    <option>Free Users</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea 
                    rows={4} 
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your message to users..."
                  ></textarea>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full gap-2">
                    <Bell size={16} />
                    Send Notification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 items-start pb-3 border-b">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                    <UserCheck size={14} />
                  </div>
                  <div>
                    <p className="font-medium">New Premium User</p>
                    <p className="text-xs text-muted-foreground">Budi Santoso upgraded to premium</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </li>
                
                <li className="flex gap-3 items-start pb-3 border-b">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-500">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="font-medium">New Goal Template</p>
                    <p className="text-xs text-muted-foreground">Emergency Fund template created</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </li>
                
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <Bell size={14} />
                  </div>
                  <div>
                    <p className="font-medium">Notification Sent</p>
                    <p className="text-xs text-muted-foreground">End of month reminder to 234 users</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View all activity
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
