import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard({ user, setUser, setToken }) {
  const [newSite, setNewSite] = useState('');
  const [blockedSites, setBlockedSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSites, setSelectedSites] = useState([]);
  const [schedule, setSchedule] = useState({
    enabled: false,
    startTime: '09:00',
    endTime: '17:00',
    days: [],
    preset: 'custom'
  });
  const [category, setCategory] = useState('General');
  const navigate = useNavigate();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['General', 'Social Media', 'Entertainment', 'Shopping', 'News', 'Gaming', 'Other'];
  
  const schedulePresets = {
    'work-hours': {
      name: 'Work Hours',
      startTime: '09:00',
      endTime: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    'weekends': {
      name: 'Weekends Only',
      startTime: '00:00',
      endTime: '23:59',
      days: ['Saturday', 'Sunday']
    },
    'all-day': {
      name: 'All Day',
      startTime: '00:00',
      endTime: '23:59',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    'custom': {
      name: 'Custom',
      startTime: '09:00',
      endTime: '17:00',
      days: []
    }
  };

  // Fetch blocked sites on load
  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blocked');
        setBlockedSites(res.data);
        setFilteredSites(res.data);
      } catch (err) {
        console.error('Fetch blocked sites error:', err.response?.data || err);
        alert('Failed to load blocked sites: ' + (err.response?.data?.msg || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, []);

  // Filter sites based on search and category
  useEffect(() => {
    let filtered = blockedSites;
    
    if (searchQuery) {
      filtered = filtered.filter(site => 
        site.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(site => site.category === selectedCategory);
    }
    
    setFilteredSites(filtered);
  }, [searchQuery, selectedCategory, blockedSites]);

  // Apply schedule preset
  const applyPreset = (presetKey) => {
    const preset = schedulePresets[presetKey];
    setSchedule({
      enabled: true,
      startTime: preset.startTime,
      endTime: preset.endTime,
      days: [...preset.days],
      preset: presetKey
    });
    setShowSchedule(true);
  };

  // Add new blocked site
  const addSite = async () => {
    if (!newSite.trim()) return alert('Enter a website URL');
    
    const url = newSite.trim();
    if (!url.includes('.') && !url.startsWith('http')) {
      return alert('Please enter a valid website URL (e.g., facebook.com, youtube.com)');
    }

    try {
      setLoading(true);
      const res = await api.post('/blocked', { 
        url: url,
        schedule: schedule.enabled ? schedule : { enabled: false, preset: 'custom' },
        category: category
      });
      setBlockedSites([...blockedSites, res.data]);
      setNewSite('');
      setSchedule({ enabled: false, startTime: '09:00', endTime: '17:00', days: [], preset: 'custom' });
      setShowSchedule(false);
      setCategory('General');
      setNote(`"${url}" has been added to your blocked sites!`);
      setTimeout(() => setNote(''), 3000);
    } catch (err) {
      console.error('Add site error:', err.response?.data || err);
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
      setTimeout(() => setNote(''), 3000);
    } catch (err) {
      console.error('Delete site error:', err.response?.data || err);
      alert('Failed to delete site: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedSites.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedSites.length} site(s)?`)) return;

    try {
      setLoading(true);
      await Promise.all(selectedSites.map(id => api.delete(`/blocked/${id}`)));
      setBlockedSites(blockedSites.filter(s => !selectedSites.includes(s._id)));
      setSelectedSites([]);
      setNote(`${selectedSites.length} site(s) deleted successfully!`);
      setTimeout(() => setNote(''), 3000);
    } catch (err) {
      alert('Failed to delete sites');
    } finally {
      setLoading(false);
    }
  };

  // Bulk toggle active
  const bulkToggleActive = async (isActive) => {
    if (selectedSites.length === 0) return;

    try {
      setLoading(true);
      await Promise.all(selectedSites.map(id => api.put(`/blocked/${id}`, { isActive })));
      setBlockedSites(blockedSites.map(s => 
        selectedSites.includes(s._id) ? { ...s, isActive } : s
      ));
      setSelectedSites([]);
      setNote(`${selectedSites.length} site(s) ${isActive ? 'enabled' : 'disabled'}!`);
      setTimeout(() => setNote(''), 3000);
    } catch (err) {
      alert('Failed to update sites');
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status
  const toggleActive = async (site) => {
    try {
      const res = await api.put(`/blocked/${site._id}`, { isActive: !site.isActive });
      setBlockedSites(blockedSites.map(s => s._id === site._id ? res.data : s));
    } catch (err) {
      console.error('Toggle active error:', err);
      alert('Failed to update site');
    }
  };

  // Update schedule
  const updateSchedule = async (siteId, newSchedule) => {
    try {
      const res = await api.put(`/blocked/${siteId}`, { schedule: newSchedule });
      setBlockedSites(blockedSites.map(s => s._id === siteId ? res.data : s));
      setEditingSite(null);
      setNote('Schedule updated successfully!');
      setTimeout(() => setNote(''), 3000);
    } catch (err) {
      console.error('Update schedule error:', err);
      alert('Failed to update schedule');
    }
  };

  // Update category
  const updateCategory = async (siteId, newCategory) => {
    try {
      const res = await api.put(`/blocked/${siteId}`, { category: newCategory });
      setBlockedSites(blockedSites.map(s => s._id === siteId ? res.data : s));
      setNote('Category updated!');
      setTimeout(() => setNote(''), 2000);
    } catch (err) {
      alert('Failed to update category');
    }
  };

  // Toggle site selection
  const toggleSelection = (siteId) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  // Select all visible
  const selectAll = () => {
    if (selectedSites.length === filteredSites.length) {
      setSelectedSites([]);
    } else {
      setSelectedSites(filteredSites.map(s => s._id));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSite();
    }
  };

  // Send token to extension
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (window.chrome && window.chrome.runtime) {
          chrome.runtime.sendMessage({ type: 'SET_TOKEN', token }, (response) => {
            if (chrome.runtime.lastError) {
              console.log('Extension not available:', chrome.runtime.lastError.message);
            }
          });
        }
      } catch (err) {
        console.log('Extension communication error:', err);
      }
    }
  }, []);

  if (!user) {
    navigate('/');
    return null;
  }

  const activeCount = blockedSites.filter(s => s.isActive).length;
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = blockedSites.filter(s => s.category === cat).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: '#1f2937', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Welcome back, <span style={{ color: '#a78bfa' }}>{user.username}</span>!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Manage your blocked websites and stay focused
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa', marginBottom: '0.5rem' }}>
            {blockedSites.length}
          </div>
          <div style={{ color: '#6b7280' }}>Total Sites</div>
        </div>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa', marginBottom: '0.5rem' }}>
            {activeCount}
          </div>
          <div style={{ color: '#6b7280' }}>Active Blocks</div>
        </div>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#a78bfa', marginBottom: '0.5rem' }}>
            {categories.length}
          </div>
          <div style={{ color: '#6b7280' }}>Categories</div>
        </div>
      </div>

      {/* Add Site Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1.5rem' }}>
          Add Website to Block
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Enter the website URL you want to block (e.g., facebook.com, youtube.com)
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter website to block (e.g., facebook.com)"
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#f3e8ff',
              color: '#1f2937',
              fontSize: '1rem'
            }}
            disabled={loading}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#1f2937',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={addSite}
            disabled={loading || !newSite.trim()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#d1d5db' : '#a78bfa',
              color: loading ? '#6b7280' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* Schedule Toggle */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) => {
                setSchedule({ ...schedule, enabled: e.target.checked });
                setShowSchedule(e.target.checked);
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Enable schedule (block only during specific times)</span>
          </label>
        </div>

        {/* Schedule Options */}
        {showSchedule && (
          <div style={{
            backgroundColor: '#f3e8ff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginTop: '1rem'
          }}>
            <h3 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1.1rem' }}>Schedule Settings</h3>
            
            {/* Schedule Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                Quick Presets
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Object.entries(schedulePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: schedule.preset === key ? '#a78bfa' : '#e5e7eb',
                      color: schedule.preset === key ? '#000' : '#1f2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value, preset: 'custom' })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#1f2937'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value, preset: 'custom' })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    background: '#ffffff',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Days of Week
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      const newDays = schedule.days.includes(day)
                        ? schedule.days.filter(d => d !== day)
                        : [...schedule.days, day];
                      setSchedule({ ...schedule, days: newDays, preset: 'custom' });
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: schedule.days.includes(day) ? '#a78bfa' : '#e5e7eb',
                      color: schedule.days.includes(day) ? '#000' : '#1f2937',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popular Sites */}
        {blockedSites.length === 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>Popular sites to block:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['facebook.com', 'youtube.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'reddit.com'].map(site => (
                <button
                  key={site}
                  onClick={() => setNewSite(site)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#a78bfa';
                    e.target.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.color = '#1f2937';
                  }}
                >
                  {site}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#f3e8ff',
              color: '#1f2937',
              fontSize: '1rem'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              color: '#1f2937',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({categoryCounts[cat] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blocked Sites List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1f2937', fontSize: '1.5rem' }}>
            Your Blocked Websites ({filteredSites.length})
          </h2>
          {selectedSites.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => bulkToggleActive(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#a78bfa',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Enable All ({selectedSites.length})
              </button>
              <button
                onClick={() => bulkToggleActive(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#d1d5db',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Disable All ({selectedSites.length})
              </button>
              <button
                onClick={bulkDelete}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Delete ({selectedSites.length})
              </button>
            </div>
          )}
        </div>
        
        {loading && blockedSites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Loading your blocked sites...
          </div>
        ) : filteredSites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {searchQuery || selectedCategory !== 'All' ? 'No sites match your filters.' : 'No websites blocked yet.'}
            </p>
            <p style={{ color: '#6b7280' }}>
              {searchQuery || selectedCategory !== 'All' ? 'Try adjusting your search or filters.' : 'Add websites above to start blocking distractions!'}
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <input
                type="checkbox"
                checked={selectedSites.length === filteredSites.length && filteredSites.length > 0}
                onChange={selectAll}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: '#1f2937', fontWeight: '500' }}>Select All</span>
            </div>
            {filteredSites.map((site, index) => (
              <div
                key={site._id}
                style={{
                  padding: '1.5rem',
                  borderBottom: index < filteredSites.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#faf5ff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={selectedSites.includes(site._id)}
                      onChange={() => toggleSelection(site._id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '0.25rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>
                          {site.url}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: site.isActive ? '#a78bfa' : '#d1d5db',
                          color: site.isActive ? '#000' : '#6b7280'
                        }}>
                          {site.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <select
                          value={site.category || 'General'}
                          onChange={(e) => updateCategory(site._id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            color: '#1f2937',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      {site.schedule && site.schedule.enabled && (
                        <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                          📅 Scheduled: {site.schedule.startTime} - {site.schedule.endTime} on {site.schedule.days.length > 0 ? site.schedule.days.join(', ') : 'No days selected'}
                          {site.schedule.preset && site.schedule.preset !== 'custom' && (
                            <span style={{ marginLeft: '0.5rem', color: '#a78bfa' }}>
                              ({schedulePresets[site.schedule.preset]?.name || 'Custom'})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {site.createdAt && (
                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                          Added: {new Date(site.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => toggleActive(site)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: site.isActive ? '#d1d5db' : '#a78bfa',
                        color: site.isActive ? '#1f2937' : '#000',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {site.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => setEditingSite(editingSite === site._id ? null : site._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e5e7eb',
                        color: '#1f2937',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => deleteSite(site)}
                      disabled={loading}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Edit Schedule */}
                {editingSite === site._id && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1.5rem',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>Edit Schedule</h4>
                    
                    {/* Presets */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                        Quick Presets
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.entries(schedulePresets).map(([key, preset]) => (
                          <button
                            key={key}
                            onClick={() => updateSchedule(site._id, {
                              enabled: true,
                              startTime: preset.startTime,
                              endTime: preset.endTime,
                              days: [...preset.days],
                              preset: key
                            })}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: (site.schedule?.preset || 'custom') === key ? '#a78bfa' : '#e5e7eb',
                              color: (site.schedule?.preset || 'custom') === key ? '#000' : '#1f2937',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={site.schedule?.startTime || '09:00'}
                          onChange={(e) => {
                            const newSchedule = {
                              ...site.schedule,
                              enabled: true,
                              startTime: e.target.value,
                              preset: 'custom'
                            };
                            updateSchedule(site._id, newSchedule);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            color: '#1f2937'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          End Time
                        </label>
                        <input
                          type="time"
                          value={site.schedule?.endTime || '17:00'}
                          onChange={(e) => {
                            const newSchedule = {
                              ...site.schedule,
                              enabled: true,
                              endTime: e.target.value,
                              preset: 'custom'
                            };
                            updateSchedule(site._id, newSchedule);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            color: '#1f2937'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        Days of Week
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            onClick={() => {
                              const currentDays = site.schedule?.days || [];
                              const newDays = currentDays.includes(day)
                                ? currentDays.filter(d => d !== day)
                                : [...currentDays, day];
                              updateSchedule(site._id, {
                                ...site.schedule,
                                enabled: true,
                                days: newDays,
                                preset: 'custom'
                              });
                            }}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: (site.schedule?.days || []).includes(day) ? '#a78bfa' : '#e5e7eb',
                              color: (site.schedule?.days || []).includes(day) ? '#000' : '#1f2937',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => updateSchedule(site._id, { enabled: false, startTime: '', endTime: '', days: [], preset: 'custom' })}
                      style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      Disable Schedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message */}
      {note && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#ffffff',
          color: '#a78bfa',
          borderRadius: '8px',
          border: '1px solid #a78bfa',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}>
          {note}
        </div>
      )}
    </div>
  );
}
