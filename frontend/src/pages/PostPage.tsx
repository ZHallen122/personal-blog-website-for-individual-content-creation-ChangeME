import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

// Define the Post interface.
interface Post {
  id: string;
  title: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  createdAt: string;
  readingTime: number;
  toc: string[];
}

// Define the Comment interface.
interface CommentType {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  content: string;
}

// Zod schema for comment form validation.
const commentSchema = z.object({
  comment: z.string().min(1, { message: 'Comment cannot be empty' }),
});
type CommentFormInputs = z.infer<typeof commentSchema>;

const PostPage: React.FC = () => {
  // Access user state from the context.
  const { user } = useUserContext();

  // Post state management.
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  // Set up react-hook-form for the comment form.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormInputs>({
    resolver: zodResolver(commentSchema),
  });

  // Fetch post data and comments (mimic an API call).
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        setLoading(true);
        // Simulate API delay.
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock post data.
        const mockPost: Post = {
          id: '1',
          title: 'Sample Blog Post Title',
          content:
            `<p>This is a sample blog post content. It contains <strong>rich formatting</strong> for demonstration purposes.</p>` +
            `<p>Additional paragraphs simulate a longer article. The content is engaging and informative, helping readers understand the topic in depth.</p>`,
          featuredImage: 'https://picsum.photos/1200/600',
          author: {
            name: 'John Doe',
            avatar: 'https://picsum.photos/200/200',
            bio: 'John Doe is a seasoned writer and content creator, passionate about storytelling and digital media.',
          },
          createdAt: new Date().toISOString(),
          readingTime: 5,
          toc: ['Introduction', 'Main Content', 'Conclusion'],
        };
        setPost(mockPost);

        // Mock comments data.
        const mockComments: CommentType[] = [
          {
            id: 'c1',
            author: {
              name: 'Alice',
              avatar: 'https://picsum.photos/50/50',
            },
            createdAt: new Date().toISOString(),
            content: 'Great post! Really enjoyed the insights.',
          },
          {
            id: 'c2',
            author: {
              name: 'Bob',
              avatar: 'https://picsum.photos/50/51',
            },
            createdAt: new Date().toISOString(),
            content: 'Thanks for sharing, very informative.',
          },
        ];
        setComments(mockComments);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  // Handle comment form submission.
  const onSubmit = async (data: CommentFormInputs) => {
    try {
      // Create a new comment.
      const newComment: CommentType = {
        id: Date.now().toString(),
        author: {
          name: user?.name || 'Anonymous',
          avatar: user?.avatar || 'https://picsum.photos/50/50',
        },
        createdAt: new Date().toISOString(),
        content: data.comment,
      };

      // Simulate an API submission delay.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setComments((prev) => [newComment, ...prev]);
      reset();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-base font-open-sans">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500 font-open-sans">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white text-[#333333] font-open-sans min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Social Share Bar for larger screens */}
        <div className="hidden lg:flex flex-col space-y-4 fixed top-1/3 left-4 z-10">
          <a
            href="#"
            className="bg-[#4A90E2] hover:bg-blue-700 text-white p-2 rounded-full transition"
            aria-label="Share on Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="bg-[#4A90E2] hover:bg-blue-700 text-white p-2 rounded-full transition"
            aria-label="Share on Twitter"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            className="bg-[#4A90E2] hover:bg-blue-700 text-white p-2 rounded-full transition"
            aria-label="Share on Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Image */}
            {post && (
              <img
                src={post.featuredImage}
                alt="Featured"
                className="w-full h-auto object-cover rounded-md"
              />
            )}
            {/* Post Header */}
            <div className="mt-4">
              <h1 className="font-bold text-3xl text-[#333333]">{post?.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                {post && (
                  <>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-bold">{post.author.name}</p>
                      <p>
                        {new Date(post.createdAt).toLocaleDateString()} &bull; {post.readingTime}{' '}
                        min read
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Post Content */}
            <div
              className="mt-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content || '' }}
            ></div>
            {/* Comments Section */}
            <div className="mt-10">
              <h2 className="font-bold text-2xl text-[#333333]">Comments</h2>
              {comments.length === 0 ? (
                <p className="text-gray-600 mt-2">No comments yet.</p>
              ) : (
                <div className="mt-4 space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-bold">
                          {comment.author.name}{' '}
                          <span className="text-gray-500 font-normal">
                            on {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Comment Form */}
              <div className="mt-6">
                {user ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                    <textarea
                      {...register('comment')}
                      placeholder="Add your comment..."
                      className="border border-gray-300 rounded-md p-2 focus:border-[#4A90E2] focus:ring focus:ring-[#4A90E2] transition min-h-[80px] resize-y"
                    />
                    {errors.comment && (
                      <span className="text-red-500 text-sm">{errors.comment.message}</span>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="self-end bg-[#4A90E2] hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-600">Please log in to comment.</p>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-16">
              {/* Author Bio */}
              {post && (
                <div className="p-4 border border-gray-200 rounded-md shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-[#333333]">{post.author.name}</p>
                    </div>
                  </div>
                  {post.author.bio && (
                    <p className="mt-2 text-gray-700 text-sm">{post.author.bio}</p>
                  )}
                </div>
              )}
              {/* Table of Contents */}
              {post && post.toc && (
                <div className="p-4 border border-gray-200 rounded-md shadow-sm">
                  <h3 className="font-bold text-lg text-[#333333] mb-2">Table of Contents</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {post.toc.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Related Posts (Mock Data) */}
              <div className="p-4 border border-gray-200 rounded-md shadow-sm">
                <h3 className="font-bold text-lg text-[#333333] mb-2">Related Posts</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-[#4A90E2] hover:underline">
                      Understanding React Hooks
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#4A90E2] hover:underline">
                      Advanced TypeScript Patterns
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#4A90E2] hover:underline">
                      Styling in Modern Web Apps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostPage;