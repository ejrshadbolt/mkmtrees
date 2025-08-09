'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Star, 
  MessageSquare, 
  Image as ImageIcon, 
  TrendingUp, 
  Calendar,
  Mail
} from 'lucide-react';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  totalSubmissions: number;
  unprocessedSubmissions: number;
  totalMedia: number;
  totalNewsletterSubscribers: number;
  activeNewsletterSubscribers: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'post' | 'review' | 'submission' | 'media';
  title: string;
  action: string;
  timestamp: string;
  author?: string;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard/stats');
      
      if (response.ok) {
        const data = await response.json() as DashboardStats;
        setStats(data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'submission':
        return <MessageSquare className="h-4 w-4" />;
      case 'media':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'text-blue-600 bg-blue-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'submission':
        return 'text-green-600 bg-green-100';
      case 'media':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Posts Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.publishedPosts} published, {stats.draftPosts} drafts
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Reviews Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingReviews} pending approval
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Submissions Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Form Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.unprocessedSubmissions} unprocessed
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Media Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Media Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedia}</p>
              <p className="text-xs text-gray-500 mt-1">
                Images and documents
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ImageIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Newsletter Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Newsletter</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNewsletterSubscribers}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeNewsletterSubscribers} active subscribers
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Mail className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.action}
                      {activity.author && ` by ${activity.author}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/posts/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Create New Post</p>
                <p className="text-sm text-gray-500">Write a new blog post</p>
              </div>
            </a>
            
            <a
              href="/admin/reviews"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Star className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Moderate Reviews</p>
                <p className="text-sm text-gray-500">Approve pending reviews</p>
              </div>
            </a>
            
            <a
              href="/admin/media"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ImageIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Upload Media</p>
                <p className="text-sm text-gray-500">Add images and files</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 