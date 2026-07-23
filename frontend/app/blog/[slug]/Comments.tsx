"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const MIST = "#F6F8FA";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

interface Comment {
  id: number; // Changed from string to number since your IDs are integers
  name: string;
  email?: string;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

function formatDate(dateString: string) {
  if (!dateString) return 'Just now';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Comments({ postId, postSlug }: { postId: string | number; postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      // ✅ Use the correct filter format for integer IDs
      const res = await fetch(
        `${API_URL}/items/comments?filter[post_id][_eq]=${postId}&filter[status][_eq]=approved&sort[]=created_at`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Directus error (GET):', errorData);
        throw new Error('Failed to fetch comments');
      }
      const data = await res.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      setErrorMessage('Please fill in your name and comment.');
      setFormStatus('error');
      return;
    }

    if (!postId) {
      setErrorMessage('Post ID is missing. Please refresh the page.');
      setFormStatus('error');
      return;
    }

    setSubmitting(true);
    setFormStatus('loading');
    setErrorMessage('');

    try {
      // ✅ Ensure post_id is sent as a number (integer)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        content: formData.content.trim(),
        post_id: Number(postId), // ✅ Convert to number
        post_slug: postSlug,
        status: 'pending',
      };

      console.log('📤 Submitting comment:', payload);

      const res = await fetch(`${API_URL}/items/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error('❌ Directus error response:', responseData);
        const errorMsg = responseData.errors?.[0]?.message || 
                        responseData.message || 
                        'Failed to submit comment. Please try again.';
        setErrorMessage(errorMsg);
        setFormStatus('error');
        return;
      }

      console.log('✅ Comment submitted successfully:', responseData);
      setFormStatus('success');
      setFormData({ name: '', email: '', content: '' });
      setShowForm(false);
      
      // Refresh comments after 2 seconds
      setTimeout(fetchComments, 2000);
    } catch (error) {
      console.error('❌ Network error submitting comment:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setFormStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-3 border-[#00AEEF]/30 border-t-[#00AEEF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" style={{ color: YPA_BLUE }} />
          <h3 className="text-xl md:text-2xl font-medium" style={{ color: INK_ON_LIGHT }}>
            Comments
          </h3>
          <span className="text-sm" style={{ color: MUTE_ON_LIGHT }}>
            ({comments.length})
          </span>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormStatus('idle');
            setErrorMessage('');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
          style={{ background: YPA_BLUE, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
        >
          {showForm ? 'Cancel' : 'Add Comment'}
          {showForm ? <X className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 md:p-6 rounded-2xl border"
              style={{ borderColor: "#E8ECF0", background: MIST }}
            >
              <h4 className="text-base font-medium mb-4" style={{ color: INK_ON_LIGHT }}>
                Join the Conversation
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-1" style={{ color: MUTE_ON_LIGHT }}>
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all"
                      style={{ borderColor: "#E8ECF0", background: "white" }}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-1" style={{ color: MUTE_ON_LIGHT }}>
                      Email (optional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all"
                      style={{ borderColor: "#E8ECF0", background: "white" }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="content" className="block text-xs font-medium mb-1" style={{ color: MUTE_ON_LIGHT }}>
                    Comment *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all resize-y min-h-[120px]"
                    style={{ borderColor: "#E8ECF0", background: "white" }}
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>

                {formStatus === 'loading' && (
                  <div className="flex items-center gap-2 text-sm text-[#00AEEF] bg-[#E6F8FD] px-4 py-3 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting your comment...</span>
                  </div>
                )}

                {formStatus === 'success' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                    <CheckCircle className="w-4 h-4" />
                    <span>Comment submitted for review. It will appear once approved.</span>
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: YPA_BLUE, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
                  >
                    {submitting ? 'Submitting...' : 'Post Comment'}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {comments.length === 0 ? (
        <div className="text-center py-8" style={{ color: MUTE_ON_LIGHT }}>
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-2xl border" style={{ borderColor: "#E8ECF0", background: "white" }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})` }}
                >
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: INK_ON_LIGHT }}>
                      {comment.name}
                    </span>
                    <span className="text-[10px]" style={{ color: MUTE_ON_LIGHT }}>
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mt-1" style={{ color: "#1E2A3A" }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}