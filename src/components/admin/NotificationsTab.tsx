
import React from 'react';
import NotificationForm from './NotificationForm';
import ActivityFeed from './ActivityFeed';

const NotificationsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NotificationForm />
      <ActivityFeed />
    </div>
  );
};

export default NotificationsTab;
