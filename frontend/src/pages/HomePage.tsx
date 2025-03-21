import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Twitter, Instagram, Facebook } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';

// Define the Post type for type safety.
interface Post {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
  author: string;
}

// Initial dummy posts data.
const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Exploring the Mountains',
    excerpt: 'Join me as I discover the breathtaking vistas of rugged mountains...',
    featuredImage: 'https://picsum.photos/500/300?random=1',
    date: '2023-09-01',
    author: 'Alice',
  },
  {
    id: '2',
    title: 'City Life Adventures',
    excerpt: "The urban landscape has its own charm. Let's dive into the vibrant city life...",
    featuredImage: 'https://picsum.photos/500/300?random=2',
    date: '2023-09-05',
    author: 'Bob',
  },
  {
    id: '3',
    title: 'Culinary Journey',
    excerpt: 'Exploring cultures through their unique culinary traditions and dishes...',
    featuredImage: 'https://picsum.photos/500/300?random=3',
    date: '2023-09-10',
    author: 'Charlie',
  },
  {
    id: '4',
    title: 'Tech Trends',
    excerpt: 'A deep dive into the latest innovations shaping our digital future...',
    featuredImage: 'https://picsum.photos/500/300?random=4',
    date: '2023-09-12',
    author: 'Dana',
  },
  {
    id: '5',
    title: 'Mindful Living',
    excerpt: 'Tips and strategies for a balanced and mindful lifestyle...',
    featuredImage: 'https://picsum.photos/500/300?random=5',
    date: '2023-09-15',
    author: 'Eve',
  },
  {
    id: '6',
    title: 'Travel Diaries',
    excerpt: 'Journey through the most scenic routes and historic landmarks...',
    featuredImage: 'https://picsum.photos/500/300?random=6',
    date: '2023-09-20',
    author: 'Frank',
  },
];

// Additional dummy posts for "Load More" functionality.
const additionalPosts: Post[] = [
  {
    id: '7',
    title: 'Art and Culture',
    excerpt: 'A look into the artistic expressions and cultural heritage...',
    featuredImage: 'https://picsum.photos/500/300?random=7',
    date: '2023-09-25',
    author: 'Grace',
  },
  {
    id: '8',
    title: 'Nature Walks',
    excerpt: 'Experience the serenity of nature with these scenic walks...',
    featuredImage: 'https://picsum.photos/500/300?random=8',
    date: '2023-09-28',
    author: 'Henry',
  },
  {
    id: '9',
    title: 'Historical Insights',
    excerpt: 'Revisiting the footsteps of history with thoughtful analysis...',
    featuredImage: 'https://picsum.photos/500/300?random=9',
    date: '2023-10-01',
    author: 'Isla',
  },
];

const HomePage: React.FC = () => {
  // Ensure the page scrolls to the top on mount.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Manage posts and loading state.
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Function to simulate loading more posts.
  const loadMorePosts = async () => {
    setLoadingMore(true);
    try {
      // Simulate an API call delay.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPosts((prevPosts) => [...prevPosts, ...additionalPosts]);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#333333]">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <section className="max-w-7xl mx-auto px-4 py-8">
          <PostsGrid posts={posts} />
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="flex items-center bg-[#4A90E2] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition transform hover:scale-105"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
              {!loadingMore && <ArrowDown size={20} className="ml-2" />}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Header component with dynamic background on scroll.
const Header: React.FC = () => {
  const { user, logout } = useUserContext();
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-open-sans font-bold text-2xl text-[#4A90E2]">
          My Personal Blog
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-open-sans text-base hover:text-[#4A90E2]">
            Home
          </Link>
          <Link to="/about" className="font-open-sans text-base hover:text-[#4A90E2]">
            About
          </Link>
          <Link to="/contact" className="font-open-sans text-base hover:text-[#4A90E2]">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.avatar && (
                <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
              )}
              <button
                onClick={logout}
                className="font-open-sans text-base text-[#4A90E2] hover:text-blue-800 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="font-open-sans text-base bg-[#4A90E2] hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

// Hero section with a background image and animated text.
const HeroSection: React.FC = () => {
  return (
    <section
      className="relative h-[50vh] md:h-[80vh] flex items-center justify-center"
      style={{ backgroundImage: "url('https://picsum.photos/1440/800')" }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center px-4"
      >
        <h1 className="font-open-sans font-bold text-4xl md:text-5xl text-white mb-4">
          Welcome to My Personal Blog
        </h1>
        <p className="font-open-sans text-lg md:text-xl text-white">
          Discover my thoughts, experiences, and stories.
        </p>
      </motion.div>
    </section>
  );
};

interface PostsGridProps {
  posts: Post[];
}

// Displays a responsive grid of post preview cards.
const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
        >
          <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="font-open-sans font-bold text-2xl mb-2">{post.title}</h2>
            <p className="font-open-sans text-base text-[#333333] mb-4">{post.excerpt}</p>
            <div className="font-open-sans text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString()}</span> &nbsp;|&nbsp; <span>{post.author}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Footer component with about info, quick links, and social media icons.
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8F8F8] text-[#333333] py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h3 className="font-open-sans font-bold text-xl mb-4">About</h3>
          <p className="font-open-sans text-base">
            A personal blog sharing thoughts, experiences, and stories.
          </p>
        </div>
        <div>
          <h3 className="font-open-sans font-bold text-xl mb-4">Quick Links</h3>
          <ul className="font-open-sans text-base space-y-2">
            <li>
              <Link to="/" className="hover:text-[#4A90E2]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#4A90E2]">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#4A90E2]">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#4A90E2]">
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-open-sans font-bold text-xl mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} className="hover:text-[#4A90E2]" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} className="hover:text-[#4A90E2]" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook size={24} className="hover:text-[#4A90E2]" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center font-open-sans text-sm">
        &copy; {new Date().getFullYear()} My Personal Blog. All rights reserved.
      </div>
    </footer>
  );
};

export default HomePage;