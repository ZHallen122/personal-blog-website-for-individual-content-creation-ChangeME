import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';

// Define the shape of the User object. This can be extended as needed.
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Define the context type which includes user data and auth methods.
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the UserContext with an undefined default value.
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props for the UserProvider.
interface UserProviderProps {
  children: ReactNode;
}

// The UserProvider component that wraps the application and provides user state.
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Manage user state.
  const [user, setUser] = useState<User | null>(null);

  // The login function simulates an API call for user authentication.
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Simulate an API call delay.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demonstration purposes, use static credentials.
      if (email === 'test@example.com' && password === 'password') {
        // Mocked user data response.
        const mockUser: User = {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'https://picsum.photos/200/200',
        };
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      // Log the error to the console and propagate it.
      console.error('Login error:', error);
      throw error;
    }
  };

  // The logout function clears the user state.
  const logout = (): void => {
    setUser(null);
  };

  // Memoize the context value to optimize performance.
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for easy access to the UserContext.
// It ensures that the hook is used within a provider.
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;