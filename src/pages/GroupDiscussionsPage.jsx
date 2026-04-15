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
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Link to={`/groups/${id}`} className="inline-flex items-center text-xs font-black text-blue-100/60 hover:text-[#D4AF37] transition-all group uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Group Overview
        </Link>
      </div>

      <div className="card !p-0 overflow-hidden shadow-2xl border-white/10">
        <div className="bg-[#002147] px-10 py-10 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/50 via-[#D4AF37] to-[#D4AF37]/50"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                <MessageSquare className="text-[#D4AF37]" size={32} /> Central Discussion Hub
              </h1>
              <p className="text-blue-100/50 uppercase tracking-[0.2em] font-black text-[10px] ml-1">{group?.groupName}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hidden md:block">
               <User className="text-[#D4AF37]/50" size={20} />
            </div>
          </div>
        </div>
        
        <div className="p-10 bg-white/5 border-b border-white/5">
          <form onSubmit={handlePostSubmit} className="relative group/form">
            <textarea
              className="w-full p-6 pr-20 bg-black/20 border border-white/10 rounded-3xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none shadow-inner text-white placeholder-white/20 font-medium"
              rows="4"
              placeholder="Post an announcement or ask a question to the group..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newPost.trim()}
              className="absolute bottom-6 right-6 bg-[#D4AF37] text-[#002147] p-4 rounded-2xl hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-900/20 disabled:opacity-30 active:scale-95 transform group-focus-within/form:scale-105"
            >
              <Send size={22} className={submitting ? 'animate-pulse' : ''} />
            </button>
          </form>
        </div>

        <div className="p-10 space-y-8 bg-[#002147]/40">
          {posts.length === 0 ? (
            <div className="text-center py-24 opacity-40">
              <div className="bg-white/5 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 rotate-6">
                <MessageSquare className="text-white" size={32} />
              </div>
              <p className="font-black text-xs uppercase tracking-[0.3em] text-blue-100">No active discussions found</p>
              <p className="text-[10px] text-blue-100/50 mt-2 font-bold uppercase">Be the first to initiate a conversation</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group/post">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#002147] to-black text-[#D4AF37] w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border border-white/10 shadow-lg">
                    {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3">
                       <h4 className="font-black text-white tracking-tight">{post.author?.name || 'Academic Peer'}</h4>
                       {post.author?.role === 'admin' && (
                         <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase tracking-widest">Administrator</span>
                       )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest">
                         {new Date(post.createdAt).toLocaleDateString()}
                       </span>
                       <div className="h-1 w-1 rounded-full bg-white/10"></div>
                       <span className="text-[10px] text-blue-100/30 font-black uppercase tracking-widest">
                         {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="pl-2 border-l-2 border-[#D4AF37]/20 group-hover/post:border-[#D4AF37] transition-all">
                  <p className="text-blue-100/80 font-medium whitespace-pre-wrap leading-relaxed text-lg">{post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDiscussionsPage;
