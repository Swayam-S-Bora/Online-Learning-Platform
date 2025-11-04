import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout, user }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🎓</div>
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            LearnHub
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium">{user?.username || 'User'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    📊 Activity
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ⚙️ Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-secondary text-blue-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;