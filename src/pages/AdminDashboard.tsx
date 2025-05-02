
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';
import StatCard from '@/components/ui/StatCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Users, UserCheck, Award, Bell, Trash2, Edit, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'free' | 'premium' | 'admin';
  status: 'active' | 'inactive';
  joined: string;
  lastActive: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Create User Schema
  const createUserSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["free", "premium", "admin"]),
  });

  // Edit User Schema
  const editUserSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["free", "premium", "admin"]),
  });
  
  // Notification Schema
  const notificationSchema = z.object({
    segment: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    type: z.enum(["info", "success", "warning", "error"])
  });
  
  const createUserForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "free",
    },
  });
  
  const editUserForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: "",
      role: "free",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      segment: "all",
      title: "",
      message: "",
      type: "info"
    },
  });

  // Fetch users
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      // Transform data
      return data.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: 'active', // For simplicity assuming all are active
        joined: new Date(user.created_at).toISOString().split('T')[0],
        lastActive: new Date(user.created_at).toISOString().split('T')[0], // We don't have last_active in DB yet
      }));
    }
  });
  
  // Fetch activity logs
  const {
    data: activityLogs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data as ActivityLog[];
    }
  });

  // Filter users based on search and selected tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedSegment === 'all') return matchesSearch;
    if (selectedSegment === 'premium') return matchesSearch && user.role === 'premium';
    if (selectedSegment === 'free') return matchesSearch && user.role === 'free';
    if (selectedSegment === 'inactive') return matchesSearch && user.status === 'inactive';
    
    return matchesSearch;
  });

  // Create new user
  const handleCreateUser = async (data: z.infer<typeof createUserSchema>) => {
    try {
      const { data: result, error } = await supabase.rpc('admin_create_user', {
        _email: data.email,
        _password: data.password,
        _full_name: data.full_name,
        _role: data.role
      });
      
      if (error) throw error;
      
      toast({
        title: "User created successfully",
        description: `New user ${data.full_name} has been added`,
      });
      
      refetchUsers();
      refetchLogs();
      createUserForm.reset();
    } catch (error: any) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Edit user
  const handleEditUser = async (data: z.infer<typeof editUserSchema>) => {
    if (!editingUser) return;
    
    try {
      const { error } = await supabase.rpc('admin_update_user', {
        _user_id: editingUser.id,
        _full_name: data.full_name,
        _role: data.role
      });
      
      if (error) throw error;
      
      toast({
        title: "User updated successfully",
        description: `User ${data.full_name} has been updated`,
      });
      
      setEditingUser(null);
      refetchUsers();
      refetchLogs();
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { error } = await supabase.rpc('admin_delete_user', {
        _user_id: userToDelete.id
      });
      
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: `User ${userToDelete.full_name} has been removed`,
      });
      
      setShowDeleteDialog(false);
      setUserToDelete(null);
      refetchUsers();
      refetchLogs();
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Send notification
  const handleSendNotification = async (data: z.infer<typeof notificationSchema>) => {
    try {
      let userId = null;
      
      if (data.segment !== 'all') {
        // For this example, let's just pick the first user matching the role
        const targetUsers = users.filter(user => {
          if (data.segment === 'premium') return user.role === 'premium';
          if (data.segment === 'free') return user.role === 'free';
          if (data.segment === 'inactive') return user.status === 'inactive';
          return false;
        });
        
        if (targetUsers.length > 0) {
          userId = targetUsers[0].id;
        }
      }
      
      const { data: result, error } = await supabase.rpc('admin_send_notification', {
        _title: data.title,
        _message: data.message,
        _type: data.type,
        _user_id: userId
      });
      
      if (error) throw error;
      
      const recipientText = userId ? "selected user" : "all users";
      
      sonnerToast.success(`Notification sent to ${recipientText}`, {
        description: `"${data.title}" has been delivered successfully.`
      });
      
      refetchLogs();
      notificationForm.reset();
    } catch (error: any) {
      toast({
        title: "Error sending notification",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // When edit user dialog is opened, set form values
  useEffect(() => {
    if (editingUser) {
      editUserForm.setValue("full_name", editingUser.full_name);
      editUserForm.setValue("role", editingUser.role);
    }
  }, [editingUser]);
  
  // Format activity log message for display
  const formatActivityLogMessage = (log: ActivityLog) => {
    const userName = log.user?.full_name || 'Anonymous';
    
    if (log.action.startsWith('created_user')) {
      return `${userName} added a new user`;
    } else if (log.action.startsWith('updated_user')) {
      return `${userName} updated user information`;
    } else if (log.action.startsWith('deleted_user')) {
      return `${userName} deleted a user account`;
    } else if (log.action.startsWith('sent_notification')) {
      return `${userName} sent a notification`;
    } else if (log.action === 'signed_up') {
      return `${userName} signed up`;
    } else if (log.action === 'completed_goal') {
      return `${userName} reached a savings goal`;
    }
    
    return log.action;
  };
  
  // Get icon for activity log
  const getActivityIcon = (log: ActivityLog) => {
    if (log.action.includes('user')) return <Users className="h-4 w-4" />;
    if (log.action.includes('notification')) return <Bell className="h-4 w-4" />;
    if (log.action === 'signed_up') return <UserCheck className="h-4 w-4" />;
    if (log.action === 'completed_goal') return <Award className="h-4 w-4" />;
    
    return <AlertTriangle className="h-4 w-4" />;
  };
  
  // Get time ago for activity log
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsAgo < 60) return 'Just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  };
  
  return (
    <DashboardLayout isAdmin={true}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, content, and system settings
            </p>
          </div>
          <img 
            src="/lovable-uploads/9dfb4bc1-064f-4b55-b196-360715fddf7f.png"
            alt="DuitTemanseru Logo" 
            className="h-12 hidden md:block" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title={t('admin.users')}
          value={users.length.toString()}
          icon={<Users size={20} />}
          variant="purple"
        />
        <StatCard 
          title={t('admin.premium')}
          value={users.filter(u => u.role === 'premium').length.toString()}
          icon={<UserCheck size={20} className="text-purple-500" />}
          trend={{ value: 8.5, isPositive: true }}
          variant="purple"
        />
        <StatCard 
          title={t('admin.free')}
          value={users.filter(u => u.role === 'free').length.toString()}
          icon={<Users size={20} className="text-teal-500" />}
          trend={{ value: 12, isPositive: true }}
          variant="teal"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-4">
                <div className="relative">
                  <Input 
                    type="search" 
                    placeholder="Search users..." 
                    className="pl-8 w-full md:w-64 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    🔍
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Export</Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600">
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account. The user will be notified by email.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...createUserForm}>
                        <form onSubmit={createUserForm.handleSubmit(handleCreateUser)} className="space-y-4 py-4">
                          <FormField
                            control={createUserForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={createUserForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={createUserForm.control}
                            name="full_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={createUserForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>User Role</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline" className="rounded-full">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600">Create User</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Tabs defaultValue="all" value={selectedSegment} onValueChange={setSelectedSegment}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="free">Free Users</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedSegment}>
                  {isLoadingUsers ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
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
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No users found matching your search
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredUsers.map(user => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{user.full_name}</span>
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
                                    {user.role === 'premium' && (
                                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                        Premium
                                      </span>
                                    )}
                                    {user.role === 'admin' && (
                                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                                        Admin
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell>{user.lastActive}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0"
                                          onClick={() => setEditingUser(user)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px] rounded-xl">
                                        <DialogHeader>
                                          <DialogTitle>Edit User</DialogTitle>
                                          <DialogDescription>
                                            Update user information. Email cannot be changed.
                                          </DialogDescription>
                                        </DialogHeader>
                                        
                                        <Form {...editUserForm}>
                                          <form onSubmit={editUserForm.handleSubmit(handleEditUser)} className="space-y-4 py-4">
                                            <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                                              <span className="text-muted-foreground text-sm">Email:</span>
                                              <span className="text-sm">{editingUser?.email}</span>
                                            </div>
                                            
                                            <FormField
                                              control={editUserForm.control}
                                              name="full_name"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>Full Name</FormLabel>
                                                  <FormControl>
                                                    <Input {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <FormField
                                              control={editUserForm.control}
                                              name="role"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel>User Role</FormLabel>
                                                  <Select 
                                                    onValueChange={field.onChange} 
                                                    defaultValue={field.value}
                                                  >
                                                    <FormControl>
                                                      <SelectTrigger>
                                                        <SelectValue placeholder="Select role" />
                                                      </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                      <SelectItem value="free">Free</SelectItem>
                                                      <SelectItem value="premium">Premium</SelectItem>
                                                      <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            
                                            <DialogFooter>
                                              <DialogClose asChild>
                                                <Button 
                                                  type="button" 
                                                  variant="outline" 
                                                  className="rounded-full"
                                                  onClick={() => setEditingUser(null)}
                                                >
                                                  Cancel
                                                </Button>
                                              </DialogClose>
                                              <Button 
                                                type="submit"
                                                className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                                              >
                                                Save Changes
                                              </Button>
                                            </DialogFooter>
                                          </form>
                                        </Form>
                                      </DialogContent>
                                    </Dialog>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => {
                                        setUserToDelete(user);
                                        setShowDeleteDialog(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="rounded-full" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="rounded-full" disabled>Next</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Send Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(handleSendNotification)} className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="segment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-full">
                              <SelectValue placeholder="Select recipients" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="premium">Premium Users</SelectItem>
                            <SelectItem value="free">Free Users</SelectItem>
                            <SelectItem value="inactive">Inactive Users</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Notification title" {...field} className="rounded-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea 
                            className="w-full p-2 border rounded-xl min-h-[100px] resize-none"
                            placeholder="Enter your message to users..."
                            {...field}
                          ></textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                      type="submit"
                    >
                      <Bell size={16} />
                      Send Notification
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoadingLogs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </div>
              ) : (
                <ul className="space-y-3 text-sm">
                  {activityLogs.slice(0, 5).map(log => (
                    <li key={log.id} className="flex gap-3 items-start pb-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-500">
                        {getActivityIcon(log)}
                      </div>
                      <div>
                        <p className="font-medium">{formatActivityLogMessage(log)}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.user?.email || 'Unknown email'}
                        </p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(log.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full rounded-full">
                View all activity
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Confirm Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user "{userToDelete?.full_name}" and all associated data. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="rounded-full"
              onClick={() => {
                setShowDeleteDialog(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="rounded-full bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
