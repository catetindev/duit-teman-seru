
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const NotificationForm = () => {
  const { toast } = useToast();
  
  // Notification Schema
  const notificationSchema = z.object({
    segment: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    type: z.enum(["info", "success", "warning", "error"])
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      segment: "all",
      title: "",
      message: "",
      type: "info"
    }
  });

  // Fetch users for targeting notifications
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Send notification
  const handleSendNotification = async (data: z.infer<typeof notificationSchema>) => {
    try {
      let userId = null;
      
      if (data.segment !== 'all') {
        // For this example, let's just pick the first user matching the role
        const targetUsers = users.filter(user => {
          if (data.segment === 'premium') return user.role === 'premium';
          if (data.segment === 'free') return user.role === 'free';
          if (data.segment === 'inactive') return false; // We don't have inactive flag in DB yet
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
      
      notificationForm.reset();
    } catch (error: any) {
      toast({
        title: "Error sending notification",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
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
              <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" type="submit">
                <Bell size={16} />
                Send Notification
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotificationForm;
