import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, User } from 'lucide-react';
import { groupService } from '../services/api';
import toast from 'react-hot-toast';

const GroupDiscussionsPage = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupData, postsData] = await Promise.all([
        groupService.getGroupDetails(id),
        groupService.getGroupPosts(id)
      ]);
      setGroup(groupData);
      setPosts(postsData);
    } catch (err) {
      console.error('Failed to fetch discussion data', err);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setSubmitting(true);
      const createdPost = await groupService.createGroupPost(id, newPost);
      setPosts([createdPost, ...posts]);
      setNewPost('');
      toast.success('Posted successfully');
    } catch (err) {
      console.error('Failed to post', err);
      toast.error(err.response?.data?.message || 'Failed to post message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading discussions...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to={`/groups/${id}`} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#002147] transition group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Group Details
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="bg-[#002147] px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="text-[#D4AF37]" /> Group Discussions
            </h1>
            <p className="text-blue-100 mt-2 font-medium">{group?.groupName}</p>
          </div>
        </div>
        
        <div className="p-8 bg-gray-50 border-b border-gray-100">
          <form onSubmit={handlePostSubmit} className="relative">
            <textarea
              className="w-full p-4 pr-16 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147] outline-none transition resize-none shadow-sm"
              rows="3"
              placeholder="Share an announcement or ask a question..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newPost.trim()}
              className="absolute bottom-4 right-4 bg-[#D4AF37] text-[#002147] p-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="p-8 space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">No discussions yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#002147] text-[#D4AF37] w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{post.author?.name || 'Unknown User'}</h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {post.author?.role === 'admin' && (
                    <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Admin</span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDiscussionsPage;
