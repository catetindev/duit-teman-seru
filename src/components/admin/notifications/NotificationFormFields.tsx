
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';

type NotificationFormData = {
  segment: string;
  title: string;
  message: string;
  type: string;
};

interface NotificationFormFieldsProps {
  form: UseFormReturn<NotificationFormData>;
}

const NotificationFormFields: React.FC<NotificationFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField 
        control={form.control} 
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
        control={form.control} 
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
        control={form.control} 
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
        control={form.control} 
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
    </>
  );
};

export default NotificationFormFields;
