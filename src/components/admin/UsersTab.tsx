import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';
import { Users, UserCheck, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ActivityFeed from './ActivityFeed';
import NotificationForm from './notifications/NotificationForm';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'free' | 'premium' | 'admin';
  status: 'active' | 'inactive';
  joined: string;
  lastActive: string;
}

const UsersTab = () => {
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
    role: z.enum(["free", "premium", "admin"])
  });

  // Edit User Schema
  const editUserSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["free", "premium", "admin"])
  });

  const createUserForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "free"
    }
  });

  const editUserForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      full_name: "",
      role: "free"
    }
  });

  // Fetch users
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;

      // Transform data
      return data.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: 'active' as 'active',
        joined: new Date(user.created_at).toISOString().split('T')[0],
        lastActive: new Date(user.created_at).toISOString().split('T')[0] 
      })) as User[];
    }
  });

  // Filter users based on search and selected tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
        description: `New user ${data.full_name} has been added`
      });
      
      refetchUsers();
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
        description: `User ${data.full_name} has been updated`
      });
      
      setEditingUser(null);
      refetchUsers();
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
        description: `User ${userToDelete.full_name} has been removed`
      });
      
      setShowDeleteDialog(false);
      setUserToDelete(null);
      refetchUsers();
    } catch (error: any) {
      toast({
        title: "Error deleting user",
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

  return (
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
                  onChange={e => setSearchQuery(e.target.value)} 
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                  <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <NotificationForm />
        <ActivityFeed />
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
    </div>
  );
};

export default UsersTab;
