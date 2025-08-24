import React, { useState } from 'react'

const Admin = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
  
  // Project Management State
  const [projects, setProjects] = useState([
    { id: 1, name: 'Modern Living Room', client: 'John Smith', status: 'In Progress', progress: 75, budget: '$15,000', startDate: '2024-01-15', endDate: '2024-03-15' },
    { id: 2, name: 'Office Renovation', client: 'Tech Corp', status: 'Completed', progress: 100, budget: '$25,000', startDate: '2023-11-01', endDate: '2024-01-30' },
    { id: 3, name: 'Kitchen Design', client: 'Sarah Johnson', status: 'Planning', progress: 25, budget: '$18,000', startDate: '2024-02-01', endDate: '2024-04-30' },
    { id: 4, name: 'Bedroom Makeover', client: 'Mike Davis', status: 'In Progress', progress: 60, budget: '$12,000', startDate: '2024-01-20', endDate: '2024-03-20' }
  ])
  
  // Message Management State
  const [messages, setMessages] = useState([
    { id: 1, name: 'Emily Wilson', email: 'emily@example.com', message: 'Interested in kitchen renovation for my new home. Looking for modern design with open concept.', time: '2 hours ago', status: 'unread' },
    { id: 2, name: 'David Brown', email: 'david@example.com', message: 'Need consultation for office space redesign. We have 2000 sq ft area to work with.', time: '4 hours ago', status: 'read' },
    { id: 3, name: 'Lisa Chen', email: 'lisa@example.com', message: 'Looking for residential design services. Budget around $30,000 for complete home renovation.', time: '1 day ago', status: 'unread' }
  ])
  
  // Contact Form Submissions State
  const [contactSubmissions, setContactSubmissions] = useState([])
  
  // Service Form Submissions State
  const [serviceSubmissions, setServiceSubmissions] = useState([])
  
  // Form States
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState({
    name: '', client: '', status: 'Planning', progress: 0, budget: '', startDate: '', endDate: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      setIsLoggedIn(true)
      // Load contact submissions from localStorage
      const contactSubs = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
      setContactSubmissions(contactSubs)
      
      // Load service submissions from localStorage
      const serviceSubs = JSON.parse(localStorage.getItem('serviceSubmissions') || '[]')
      setServiceSubmissions(serviceSubs)
    } else {
      alert('Invalid credentials! Use admin/admin123')
    }
  }

  // Project Management Functions
  const addProject = (e) => {
    e.preventDefault()
    const project = {
      ...newProject,
      id: projects.length + 1,
      progress: parseInt(newProject.progress)
    }
    setProjects([...projects, project])
    setNewProject({ name: '', client: '', status: 'Planning', progress: 0, budget: '', startDate: '', endDate: '' })
    setShowAddProject(false)
  }

  const updateProject = (e) => {
    e.preventDefault()
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id ? { ...editingProject, progress: parseInt(editingProject.progress) } : p
    )
    setProjects(updatedProjects)
    setEditingProject(null)
  }

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  // Message Management Functions
  const markMessageAsRead = (id) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, status: 'read' } : m
    ))
  }

  const deleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(m => m.id !== id))
    }
  }

  // Contact Submission Management Functions
  const markContactAsRead = (id) => {
    const updatedSubmissions = contactSubmissions.map(submission => 
      submission.id === id ? { ...submission, status: 'read' } : submission
    )
    setContactSubmissions(updatedSubmissions)
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions))
  }

  const deleteContactSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      const updatedSubmissions = contactSubmissions.filter(submission => submission.id !== id)
      setContactSubmissions(updatedSubmissions)
      localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions))
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  // Service Submission Management Functions
  const markServiceAsRead = (id) => {
    const updatedSubmissions = serviceSubmissions.map(submission => 
      submission.id === id ? { ...submission, status: 'read' } : submission
    )
    setServiceSubmissions(updatedSubmissions)
    localStorage.setItem('serviceSubmissions', JSON.stringify(updatedSubmissions))
  }

  const deleteServiceSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this service submission?')) {
      const updatedSubmissions = serviceSubmissions.filter(submission => submission.id !== id)
      setServiceSubmissions(updatedSubmissions)
      localStorage.setItem('serviceSubmissions', JSON.stringify(updatedSubmissions))
    }
  }

  const stats = [
    { title: 'Total Projects', value: projects.length.toString(), change: '+12%', icon: '📊' },
    { title: 'Active Clients', value: new Set(projects.map(p => p.client)).size.toString(), change: '+8%', icon: '👥' },
    { title: 'Revenue', value: `$${(projects.reduce((sum, p) => sum + parseInt(p.budget.replace(/[$,]/g, '') || 0), 0) / 1000).toFixed(1)}K`, change: '+15%', icon: '💰' },
    { title: 'Contact Submissions', value: contactSubmissions.length.toString(), change: '+3%', icon: '📧' },
    { title: 'Service Inquiries', value: serviceSubmissions.length.toString(), change: '+5%', icon: '🏠' },
    { title: 'Unread Submissions', value: (contactSubmissions.filter(c => c.status === 'unread').length + serviceSubmissions.filter(s => s.status === 'unread').length).toString(), change: '-2%', icon: '📋' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">PrideSpan Admin Dashboard</h1>
              <p className="text-blue-100">Manage your interior design business</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          /* Login Form */
          <div className="p-8 flex items-center justify-center h-full">
            <div className="bg-gray-50 rounded-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginCredentials.username}
                    onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  Login
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Demo credentials: admin / admin123
              </p>
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4">
                <ul className="space-y-2">
                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                    { id: 'projects', name: 'Projects', icon: '🏠' },
                    { id: 'messages', name: 'Messages', icon: '💬' },
                    { id: 'contacts', name: 'Contact Submissions', icon: '📧' },
                    { id: 'services', name: 'Service Inquiries', icon: '🔧' },
                    { id: 'settings', name: 'Settings', icon: '⚙️' }
                  ].map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        {tab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{stat.title}</p>
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className="text-3xl">{stat.icon}</div>
                          </div>
                          <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Projects */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
                      <div className="space-y-4">
                        {projects.slice(0, 4).map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{project.name}</h4>
                              <p className="text-sm text-gray-600">{project.client} • {project.budget}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status}
                              </span>
                              <div className="mt-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{project.progress}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
                      <button 
                        onClick={() => setShowAddProject(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add New Project
                      </button>
                    </div>
                    
                    {/* Add Project Modal */}
                    {showAddProject && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Project</h3>
                          <form onSubmit={addProject} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                <input
                                  type="text"
                                  value={newProject.name}
                                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                <input
                                  type="text"
                                  value={newProject.client}
                                  onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                  value={newProject.status}
                                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="Planning">Planning</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={newProject.progress}
                                  onChange={(e) => setNewProject({...newProject, progress: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                                <input
                                  type="text"
                                  value={newProject.budget}
                                  onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="$0"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                  type="date"
                                  value={newProject.startDate}
                                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                              <button
                                type="button"
                                onClick={() => setShowAddProject(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Add Project
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Edit Project Modal */}
                    {editingProject && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Project</h3>
                          <form onSubmit={updateProject} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                <input
                                  type="text"
                                  value={editingProject.name}
                                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                <input
                                  type="text"
                                  value={editingProject.client}
                                  onChange={(e) => setEditingProject({...editingProject, client: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                  value={editingProject.status}
                                  onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="Planning">Planning</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editingProject.progress}
                                  onChange={(e) => setEditingProject({...editingProject, progress: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                              <button
                                type="button"
                                onClick={() => setEditingProject(null)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Update Project
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Projects Table */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4">Project Name</th>
                              <th className="text-left py-3 px-4">Client</th>
                              <th className="text-left py-3 px-4">Status</th>
                              <th className="text-left py-3 px-4">Progress</th>
                              <th className="text-left py-3 px-4">Budget</th>
                              <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project) => (
                              <tr key={project.id} className="border-b border-gray-100">
                                <td className="py-3 px-4 font-medium">{project.name}</td>
                                <td className="py-3 px-4">{project.client}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {project.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${project.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm">{project.progress}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{project.budget}</td>
                                <td className="py-3 px-4">
                                  <button 
                                    onClick={() => setEditingProject(project)}
                                    className="text-blue-600 hover:text-blue-800 mr-2 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteProject(project.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Messages</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className={`border border-gray-200 rounded-lg p-4 ${message.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{message.name}</h4>
                                <p className="text-sm text-gray-600">{message.email}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-500">{message.time}</span>
                                {message.status === 'unread' && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{message.message}</p>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Reply</button>
                              {message.status === 'unread' && (
                                <button 
                                  onClick={() => markMessageAsRead(message.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  Mark as Read
                                </button>
                              )}
                              <button 
                                onClick={() => deleteMessage(message.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Form Submissions</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      {contactSubmissions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No contact submissions yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {contactSubmissions.map((submission) => (
                            <div key={submission.id} className={`border border-gray-200 rounded-lg p-4 ${submission.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{submission.firstName} {submission.lastName}</h4>
                                  <p className="text-sm text-gray-600">{submission.email}</p>
                                  <p className="text-sm text-gray-600">{submission.phone}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-gray-500">{formatTimestamp(submission.timestamp)}</span>
                                  {submission.status === 'unread' && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                                  )}
                                </div>
                              </div>
                              <div className="mb-3">
                                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mb-2">
                                  Project Type: {submission.projectType}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{submission.message}</p>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Reply</button>
                                {submission.status === 'unread' && (
                                  <button 
                                    onClick={() => markContactAsRead(submission.id)}
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteContactSubmission(submission.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
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
                )}

                {activeTab === 'services' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Inquiry Submissions</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      {serviceSubmissions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No service inquiries yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {serviceSubmissions.map((submission) => (
                            <div key={submission.id} className={`border border-gray-200 rounded-lg p-4 ${submission.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{submission.name}</h4>
                                  <p className="text-sm text-gray-600">{submission.email}</p>
                                  <p className="text-sm text-gray-600">{submission.phone}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-gray-500">{formatTimestamp(submission.timestamp)}</span>
                                  {submission.status === 'unread' && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                                  )}
                                </div>
                              </div>
                              <div className="mb-3 space-y-2">
                                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                  Service: {submission.service}
                                </span>
                                <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-sm ml-2">
                                  Budget: {submission.budget}
                                </span>
                                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm ml-2">
                                  Timeline: {submission.timeline}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{submission.message}</p>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Reply</button>
                                {submission.status === 'unread' && (
                                  <button 
                                    onClick={() => markServiceAsRead(submission.id)}
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Mark as Read
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteServiceSubmission(submission.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
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
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                              </label>
                              <input
                                type="text"
                                defaultValue="PrideSpan Interior Design"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Email
                              </label>
                              <input
                                type="email"
                                defaultValue="hello@pridespan.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                defaultValue="+1 (555) 123-4567"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
