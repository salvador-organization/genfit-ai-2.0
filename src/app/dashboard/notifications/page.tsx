'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  ChevronLeft,
  Check,
  CheckCheck,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Award,
  Calendar,
  Settings,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/supabase/queries';
import type { Notification } from '@/lib/types/fitai';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadNotifications();
  }, [user, router, filter]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const data = await getNotifications(user.id, filter === 'unread');
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout_reminder':
        return <Dumbbell className="h-5 w-5" />;
      case 'meal_reminder':
        return <UtensilsCrossed className="h-5 w-5" />;
      case 'progress_update':
        return <TrendingUp className="h-5 w-5" />;
      case 'streak_milestone':
        return <Award className="h-5 w-5" />;
      case 'plan_adjustment':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 backdrop-blur-sm dark:bg-black/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white">
                <Bell className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Notificações</span>
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-black text-white dark:bg-white dark:text-black">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="border-gray-300 dark:border-gray-700"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/configuracoes">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-black text-white dark:bg-white dark:text-black' : 'border-gray-300 dark:border-gray-700'}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-black text-white dark:bg-white dark:text-black' : 'border-gray-300 dark:border-gray-700'}
          >
            Não lidas ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition-all border-gray-200 dark:border-gray-800 ${
                  !notification.read ? 'bg-gray-50 dark:bg-gray-900' : ''
                }`}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id);
                  }
                  if (notification.action_url) {
                    router.push(notification.action_url);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    !notification.read 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-black dark:bg-white flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>

                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="flex-shrink-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-gray-200 dark:border-gray-800">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {filter === 'unread' ? 'Tudo em dia!' : 'Nenhuma notificação'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'unread' 
                ? 'Você não tem notificações não lidas.' 
                : 'Você ainda não recebeu nenhuma notificação.'}
            </p>
            <Button variant="outline" asChild className="border-gray-300 dark:border-gray-700">
              <Link href="/dashboard">
                Voltar ao Dashboard
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
