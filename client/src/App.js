const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com' 
  : 'http://localhost:5000';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: 'Personal' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/contacts${searchTerm ? `?search=${searchTerm}` : ''}`;
      if (selectedCategory !== 'All') {
        url += `${searchTerm ? '&' : '?'}category=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setContacts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchContacts, searchTerm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    const errors = [];

    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      errors.push('Please enter a valid email');
    }
    if (!phone.match(/^[0-9]{10,15}$/)) {
      errors.push('Phone number must be 10-15 digits');
    }

    if (errors.length > 0) {
      setError(errors[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/contacts/${editingId}`, formData);
        setSuccess('Contact updated successfully');
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/contacts`, formData);
        setSuccess('Contact added successfully');
      }
      setFormData({ name: '', email: '', phone: '', category: 'Personal' });
      fetchContacts();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
      console.error('Error saving contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      category: contact.category || 'Personal'
    });
    setEditingId(contact._id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/api/contacts/${id}`);
        setSuccess('Contact deleted successfully');
        fetchContacts();
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete contact');
        console.error('Error deleting contact:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      setError('No contacts selected');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`)) {
      try {
        setLoading(true);
        await Promise.all(selectedContacts.map(id => axios.delete(`${API_BASE_URL}/api/contacts/${id}`)));
        setSuccess(`${selectedContacts.length} contact(s) deleted successfully`);
        setSelectedContacts([]);
        fetchContacts();
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete contacts');
        console.error('Error deleting contacts:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const exportContacts = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'contacts.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importContacts = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedContacts = JSON.parse(e.target.result);
          for (const contact of importedContacts) {
            await axios.post(`${API_BASE_URL}/api/contacts`, contact);
          }
          setSuccess(`${importedContacts.length} contacts imported successfully`);
          fetchContacts();
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          setError('Failed to import contacts');
          console.error('Error importing contacts:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleContactSelection = (id) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c._id));
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', phone: '', category: 'Personal' });
    setEditingId(null);
    setError('');
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Contact Management</h1>
        
        {/* Contact Form */}
        <div className="form-container">
          <h2>{editingId ? 'Edit Contact' : 'Add New Contact'}</h2>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-container">
          <div className="search-row">
            <input
              type="text"
              placeholder="Search contacts by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-row">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="All">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Other">Other</option>
            </select>
            
            <div className="action-buttons">
              <button onClick={exportContacts} className="btn-export">
                Export
              </button>
              <label className="btn-import">
                Import
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importContacts} 
                  style={{display: 'none'}}
                />
              </label>
              {selectedContacts.length > 0 && (
                <button 
                  onClick={handleBulkDelete} 
                  className="btn-bulk-delete"
                  disabled={loading}
                >
                  Delete Selected ({selectedContacts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="contacts-container">
          <div className="contacts-header">
            <h2>Contacts ({contacts.length})</h2>
            {contacts.length > 0 && (
              <div className="bulk-actions">
                <label className="select-all">
                  <input 
                    type="checkbox" 
                    checked={selectedContacts.length === contacts.length && contacts.length > 0}
                    onChange={selectAllContacts}
                  />
                  Select All
                </label>
              </div>
            )}
          </div>
          {loading && <div className="loading">Loading...</div>}
          
          {contacts.length === 0 ? (
            <div className="no-contacts">
              {searchTerm || selectedCategory !== 'All' 
                ? 'No contacts found matching your criteria.' 
                : 'No contacts yet. Add your first contact above!'}
            </div>
          ) : (
            <div className="contacts-grid">
              {contacts.map((contact) => (
                <div key={contact._id} className={`contact-card ${selectedContacts.includes(contact._id) ? 'selected' : ''}`}>
                  <div className="contact-header">
                    <div className="contact-avatar">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="contact-info">
                      <h3>
                        {contact.name}
                      </h3>
                      <span className={`category-badge category-${(contact.category || 'other').toLowerCase()}`}>{contact.category || 'Other'}</span>
                    </div>
                    <div className="contact-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => toggleContactSelection(contact._id)}
                      />
                    </div>
                  </div>
                  
                  <div className="contact-details">
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Phone:</strong> {contact.phone}</p>
                  </div>
                  
                  <div className="contact-actions">
                    <button 
                      onClick={() => handleEdit(contact)} 
                      className="btn-edit"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(contact._id)} 
                      className="btn-delete"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
