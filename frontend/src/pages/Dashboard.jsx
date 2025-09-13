import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard({ user, setUser, setToken }) {
  const [newSite, setNewSite] = useState('');
  const [blockedSites, setBlockedSites] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch blocked sites on load
  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blocked');
        setBlockedSites(res.data);
      } catch (err) {
        console.error('Fetch blocked sites error:', err.response?.data || err);
        alert('Failed to load blocked sites: ' + (err.response?.data?.msg || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, []);

  // Add new blocked site
  const addSite = async () => {
    if (!newSite.trim()) return alert('Enter a website URL');
    
    // Basic URL validation
    const url = newSite.trim();
    if (!url.includes('.') && !url.startsWith('http')) {
      return alert('Please enter a valid website URL (e.g., facebook.com, youtube.com)');
    }

    try {
      setLoading(true);
      console.log('Adding site:', url);
      console.log('Token:', localStorage.getItem('token'));
      const res = await api.post('/blocked', { url: url });
      console.log('Response:', res.data);
      setBlockedSites([...blockedSites, res.data]);
      setNewSite('');
      setNote(''); // Clear any previous notes
    } catch (err) {
      console.error('Add site error:', err.response?.data || err);
      console.error('Full error:', err);
      alert('Failed to add site: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete a blocked site
  const deleteSite = async (site) => {
    if (!confirm(`Are you sure you want to remove "${site.url}" from your blocked sites?`)) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/blocked/${site._id}`);
      setBlockedSites(blockedSites.filter(s => s._id !== site._id));
      setNote(`"${site.url}" has been removed from your blocked sites.`);
    } catch (err) {
      console.error('Delete site error:', err.response?.data || err);
      alert('Failed to delete site: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      navigate('/');
    }
  };

  // Handle Enter key press for adding sites
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSite();
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#6a0dad', margin: 0 }}>Hello, {user.username}!</h2>
        <button
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            padding: '0.5rem 1rem', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '2rem', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '10px', border: '1px solid #e9ecef' }}>
        <h3 style={{ color: '#6a0dad', marginTop: 0 }}>Add Website to Block</h3>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
          Enter the website URL you want to block (e.g., facebook.com, youtube.com, twitter.com)
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter website to block (e.g., facebook.com)"
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
            disabled={loading}
          />
          <button
            onClick={addSite}
            disabled={loading || !newSite.trim()}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: loading ? '#ccc' : '#6a0dad', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      <div>
        <h3 style={{ color: '#6a0dad' }}>Your Blocked Websites</h3>
        {loading && blockedSites.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>Loading your blocked sites...</p>
        ) : blockedSites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>No websites blocked yet.</p>
            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Add websites above to start blocking distractions!</p>
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <p style={{ color: '#6a0dad', fontWeight: 'bold', marginBottom: '0.5rem' }}>Popular websites to block:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {['facebook.com', 'youtube.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'reddit.com'].map(site => (
                  <button
                    key={site}
                    onClick={() => setNewSite(site)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#6a0dad',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {site}
                  </button>
                ))}
              </div>
              <p style={{ color: '#6c757d', fontSize: '0.9rem', marginTop: '0.5rem' }}>Click any button above to add it to your blocked list!</p>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
            {blockedSites.map((site, index) => (
              <div 
                key={site._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem',
                  borderBottom: index < blockedSites.length - 1 ? '1px solid #e9ecef' : 'none',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold', color: '#495057' }}>{site.url}</span>
                  {site.createdAt && (
                    <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.25rem' }}>
                      Added: {new Date(site.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteSite(site)}
                  disabled={loading}
                  style={{ 
                    backgroundColor: loading ? '#ccc' : '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '5px', 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {note && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#d4edda', 
          borderRadius: '5px', 
          border: '1px solid #c3e6cb',
          color: '#155724'
        }}>
          {note}
        </div>
      )}
    </div>
  );
}