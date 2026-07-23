"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  ThumbsUp,
  Reply,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ============================================================
// YPA BRAND COLORS
// ============================================================
const YPA_BLUE = "#00AEEF";
const YPA_BLUE_LIGHT = "#33C1F5";
const YPA_BLUE_SOFT = "#E6F8FD";
const YPA_GOLD = "#F0B429";
const MIST = "#F6F8FA";
const INK_ON_LIGHT = "#111111";
const MUTE_ON_LIGHT = "#5B6B7A";
const TEXT_PRIMARY = "#0A1628";
const TEXT_SECONDARY = "#2D3748";
const CARD_BG = "#FFFFFF";
const BORDER_LIGHT = "#E8ECF0";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

interface Comment {
  id: number;
  name: string;
  email?: string;
  content: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  post_id: number;
}

const COMMENTS_PER_PAGE = 20;

function formatDate(dateString: string) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  
  if (diff < 1) return 'Today';
  if (diff < 2) return 'Yesterday';
  if (diff < 7) return `${Math.floor(diff)} days ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function Comments({ postId, postSlug }: { postId: string | number; postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [allCommentsLoaded, setAllCommentsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // ✅ Debug: Log what postId is being used
  useEffect(() => {
    console.log('🔍 Comments component mounted with:', { postId, postSlug, type: typeof postId });
  }, [postId, postSlug]);

  // ✅ Fetch comments with proper filtering
  const fetchComments = useCallback(async (resetPage: boolean = true) => {
    if (!postId) {
      console.error('❌ No postId provided to Comments component');
      setLoading(false);
      return;
    }

    try {
      const currentPage = resetPage ? 1 : page;
      const sort = sortOrder === 'newest' ? '-created_at' : 'created_at';
      const offset = (currentPage - 1) * COMMENTS_PER_PAGE;
      
      // ✅ Convert postId to number for filtering
      const numericPostId = Number(postId);
      
      // ✅ Use the correct filter format for integer post_id
      const filterQuery = `filter[post_id][_eq]=${numericPostId}&filter[status][_eq]=approved`;
      const url = `${API_URL}/items/comments?${filterQuery}&sort[]=${sort}&limit=${COMMENTS_PER_PAGE}&offset=${offset}`;
      
      console.log('📡 Fetching comments for post_id:', numericPostId);
      console.log('📡 URL:', url);
      
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Directus error (GET):', errorData);
        throw new Error('Failed to fetch comments');
      }
      const data = await res.json();
      
      console.log('📥 Comments fetched:', data.data?.length || 0, 'comments');
      console.log('📥 Raw data:', data);
      
      // Get total count
      const totalRes = await fetch(
        `${API_URL}/items/comments?${filterQuery}&aggregate[count]=*`,
        { cache: 'no-store' }
      );
      const totalData = await totalRes.json();
      const total = totalData.data?.[0]?.count || 0;
      setTotalComments(total);
      
      const newComments = data.data || [];
      
      if (resetPage) {
        setComments(newComments);
        setPage(1);
        setHasMore(newComments.length < total);
        setAllCommentsLoaded(newComments.length >= total);
        setDebugInfo(`Showing ${newComments.length} of ${total} comments for post ${numericPostId}`);
      } else {
        setComments(prev => [...prev, ...newComments]);
        const newTotal = comments.length + newComments.length;
        setHasMore(newTotal < total);
        setAllCommentsLoaded(newTotal >= total);
        setDebugInfo(`Showing ${newTotal} of ${total} comments`);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [postId, sortOrder, page, comments.length]);

  // ✅ Load more comments
  const loadMoreComments = async () => {
    if (loadingMore || allCommentsLoaded) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchComments(false);
  };

  // ✅ Initial load and sort changes
  useEffect(() => {
    if (postId) {
      console.log('🔄 Refreshing comments for post:', postId);
      setLoading(true);
      setPage(1);
      setComments([]);
      fetchComments(true);
    }
  }, [postId, sortOrder]);

  // ✅ Handle new comment submission
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
      const numericPostId = Number(postId);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        content: formData.content.trim(),
        post_id: numericPostId,
        post_slug: postSlug,
        status: 'pending',
      };

      console.log('📤 Submitting comment with post_id:', numericPostId);
      console.log('📤 Payload:', payload);

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
      setTimeout(() => {
        setPage(1);
        fetchComments(true);
      }, 2000);
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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-[#00AEEF]/30 border-t-[#00AEEF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===== DEBUG INFO (Remove after testing) ===== */}
      <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
        Debug: {debugInfo} | Post ID: {postId} | Total: {totalComments}
      </div>

      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: YPA_BLUE_SOFT }}>
            <MessageCircle className="w-5 h-5" style={{ color: YPA_BLUE }} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-medium" style={{ color: TEXT_PRIMARY }}>
              Comments
            </h3>
            <p className="text-sm" style={{ color: MUTE_ON_LIGHT }}>
              {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
            style={{ 
              background: MIST,
              color: MUTE_ON_LIGHT,
              border: `1px solid ${BORDER_LIGHT}`
            }}
          >
            {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            {sortOrder === 'newest' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
          
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormStatus('idle');
              setErrorMessage('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})`, boxShadow: `0 20px 40px -12px ${YPA_BLUE}66` }}
          >
            {showForm ? 'Cancel' : 'Add Comment'}
            {showForm ? <X className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ===== COMMENT FORM ===== */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="p-6 md:p-8 rounded-2xl border shadow-sm"
              style={{ borderColor: BORDER_LIGHT, background: MIST }}
            >
              <h4 className="text-base font-medium mb-4" style={{ color: TEXT_PRIMARY }}>
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
                      style={{ borderColor: BORDER_LIGHT, background: CARD_BG }}
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
                      style={{ borderColor: BORDER_LIGHT, background: CARD_BG }}
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
                    style={{ borderColor: BORDER_LIGHT, background: CARD_BG }}
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

      {/* ===== COMMENTS LIST ===== */}
      {comments.length === 0 ? (
        <div className="text-center py-12" style={{ color: MUTE_ON_LIGHT }}>
          <div className="text-4xl mb-3 opacity-30">💬</div>
          <p className="text-sm">No approved comments yet for this post.</p>
          <p className="text-xs mt-2 opacity-50">Debug: {debugInfo}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-5 rounded-2xl border transition-all hover:shadow-sm" style={{ borderColor: BORDER_LIGHT, background: CARD_BG }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, ${YPA_BLUE}, ${YPA_BLUE_LIGHT})` }}
                >
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: TEXT_PRIMARY }}>
                      {comment.name}
                    </span>
                    <span className="text-[10px]" style={{ color: MUTE_ON_LIGHT }}>
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mt-1" style={{ color: TEXT_SECONDARY }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* ===== LOAD MORE ===== */}
          {hasMore && !allCommentsLoaded && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMoreComments}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ 
                  background: MIST,
                  color: TEXT_PRIMARY,
                  border: `1px solid ${BORDER_LIGHT}`
                }}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load more comments
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* ===== END OF COMMENTS ===== */}
          {allCommentsLoaded && comments.length > 0 && (
            <div className="text-center pt-4">
              <p className="text-xs" style={{ color: MUTE_ON_LIGHT }}>
                🎉 You've seen all {totalComments} comments
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}