import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';


export default function Admin() {
  const [activeTab, setActiveTab] = useState('skills');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();


  const fetchItems = async () => {
    setLoading(true);
    const storageKey = `portfolio_${activeTab}`;
    const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Default to local data
    setItems(localData);

    try {
      const res = await fetch(`${API_BASE_URL}/${activeTab}`);
      if (res.ok) {
        const backendData = await res.json();
        // Only override if the backend actually has items
        if (backendData && backendData.length > 0) {
          setItems(backendData);
          localStorage.setItem(storageKey, JSON.stringify(backendData));
        }
      }
    } catch (error) {
      console.warn("Backend offline, using local data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const [formData, setFormData] = useState({
    name: '', title: '', description: '', proficiency: '',
    techStack: '', projectLink: '', issuer: '', visible: true,
    institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', score: '',
    imageUrl: '', certificateUrl: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Prepare Payload
    let payload = { name: formData.name, visible: formData.visible };
    if (activeTab === 'skills') payload.proficiency = formData.proficiency;
    else if (activeTab === 'projects') {
      payload.description = formData.description;
      payload.techStack = formData.techStack;
      payload.projectLink = formData.projectLink;
    } else if (activeTab === 'certificates') {
      payload.description = formData.description;
      // No issuer or certificateUrl as requested
    } else if (activeTab === 'education') {
      payload = {
        institution: formData.institution,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startDate: formData.startDate,
        endDate: formData.endDate,
        score: formData.score,
        description: formData.description,
        visible: formData.visible
      };
    }

    // 2. IMPORTANT: Save LOCALLY first for instant feedback
    const storageKey = `portfolio_${activeTab}`;
    const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newItem = { ...payload, id: 'local-' + Date.now() }; // Temporary local ID
    const updatedData = [...localData, newItem];
    
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    setItems(updatedData);
    
    // 3. Reset form and alert success instantly
    setFormData({
      name: '', title: '', description: '', proficiency: '',
      techStack: '', projectLink: '', issuer: '', visible: true,
      institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', score: '',
      imageUrl: '', certificateUrl: ''
    });
    alert(`${activeTab.slice(0, -1)} added!`);

    // 4. Try to sync to backend in the background
    try {
      let res;
      if (activeTab === 'certificates' && selectedFile) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('visible', formData.visible);
        data.append('file', selectedFile);

        res = await fetch(`${API_BASE_URL}/${activeTab}`, {
          method: 'POST',
          body: data // Fetch will set correct Content-Type with boundary
        });
      } else {
        res = await fetch(`${API_BASE_URL}/${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setSelectedFile(null); // Clear file
        fetchItems(); // Refresh with real backend IDs
      }
    } catch (error) {
      console.warn("Could not sync new item to backend, it remains stored locally.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    console.log("Attempting to delete item with ID:", id);

    try {
      // 1. Try backend first
      const res = await fetch(`${API_BASE_URL}/${activeTab}/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        console.log("Backend delete successful");
        fetchItems();
        return;
      }
      throw new Error(`Backend error: ${res.status}`);
    } catch (error) {
      console.warn("Backend delete failed or unreachable. Cleaning up locally...", error);
      
      const storageKey = `portfolio_${activeTab}`;
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Filter out the item (loose check for string/number match)
      const updatedData = localData.filter(item => item.id != id);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      setItems(updatedData);
      
      alert('Removed item from local storage (Server was unreachable).');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const tabs = [
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'certificates', label: 'Certificates' }
  ];

  return (
    <div className="container admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Admin <span>Dashboard</span></h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/')} className="btn-outline">Back to Portfolio</button>
          <button onClick={handleLogout} className="btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form className="admin-form animate-up" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Add New {activeTab.slice(0, -1)}</h3>
        
        {activeTab !== 'education' && (
          <div className="form-group">
            <label>{activeTab === 'projects' ? 'Project Name' : 'Name'}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        {activeTab === 'education' && (
          <>
            <div className="form-group">
              <label>Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. 2020"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. 2024 or Present"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Score/GPA</label>
              <input
                type="text"
                name="score"
                value={formData.score}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </>
        )}

        {activeTab !== 'skills' && (
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
              required
            ></textarea>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="form-group">
            <label>Proficiency</label>
            <select
              name="proficiency"
              value={formData.proficiency}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        )}

        {activeTab === 'projects' && (
          <>
            <div className="form-group">
              <label>Tech Stack</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                className="form-input"
                placeholder="React, Node.js, etc."
              />
            </div>
            <div className="form-group">
              <label>Project Link</label>
              <input
                type="url"
                name="projectLink"
                value={formData.projectLink}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </>
        )}

        {activeTab === 'certificates' && (
          <>
            <div className="form-group">
              <label>Certificate Image</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="form-input"
                accept="image/*"
                required
              />
            </div>
          </>
        )}


        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleInputChange}
            id="visible-check"
          />
          <label htmlFor="visible-check" style={{ margin: 0 }}>Visible on frontend</label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Add {activeTab.slice(0, -1)}
        </button>
      </form>

      <div className="admin-list animate-up" style={{ animationDelay: '0.2s' }}>
        <h3 style={{ marginBottom: '2rem' }}>Existing {activeTab}</h3>
        {loading ? <p>Loading...</p> : (
          items.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No {activeTab} added yet.</p> : (
            items.map(item => (
              <div key={item.id} className="admin-item">
                <div>
                  <h4 style={{ margin: 0 }}>{item.name || item.institution}</h4>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {item.visible ? 'Visible' : 'Hidden'} {activeTab === 'education' ? `- ${item.degree}` : ''}
                  </small>
                </div>
                <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
              </div>
            ))
          )
        )}
      </div>
      <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5 }}>
        <button 
          onClick={() => {
            if(window.confirm('Clear all local data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
        >
          Reset All Admin Data
        </button>
      </div>
    </div>
  );
}
