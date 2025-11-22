import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Admin = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  
  // Project Management State
  const [projects, setProjects] = useState([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [newProject, setNewProject] = useState({
    name: '', client: '', status: 'Planning', progress: 0, budget: '', startDate: '', endDate: ''
  })
  
  // Contact Form Submissions State
  const [contactSubmissions, setContactSubmissions] = useState([])
  
  // Service Form Submissions State
  const [serviceSubmissions, setServiceSubmissions] = useState([])

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setIsLoggedIn(true)
          setAdminUser(session.user)
          loadDashboardData()
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkSession()
  }, [])



  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      // Step 1: Authenticate using Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginCredentials.email,
        password: loginCredentials.password
      })

      if (authError) {
        setLoginError(authError.message || 'Invalid email or password')
        setLoginLoading(false)
        return
      }

      // Step 2: Verify user exists in admin_users table
      try {
        // First, let's test if the table is accessible by fetching all records
        console.log('Testing admin_users table access...')
        const { data: allAdmins, error: testError } = await supabase
          .from('admin_users')
          .select('*')

        if (testError) {
          console.error('Table access error:', testError)
          setLoginError(`Database error: ${testError.message}`)
          await supabase.auth.signOut()
          setLoginLoading(false)
          return
        }

        console.log('All admin users:', allAdmins)

        // Now check if the logged-in user is in the admin list
        const adminUserData = allAdmins?.find(admin =>
          admin.username === loginCredentials.email || admin.email === loginCredentials.email
        )

        if (!adminUserData) {
          console.log('User not found in admin_users table')
          setLoginError('User is not an admin')
          await supabase.auth.signOut()
          setLoginLoading(false)
          return
        }

        console.log('Admin user found:', adminUserData)
      } catch (err) {
        console.error('Admin verification exception:', err)
        setLoginError('Database connection error. Please try again.')
        await supabase.auth.signOut()
        setLoginLoading(false)
        return
      }

      // Step 3: Login successful
      setIsLoggedIn(true)
      setAdminUser(authData.user)
      setLoginCredentials({ email: '', password: '' })
      
      // Load dashboard data
      loadDashboardData()
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An error occurred during login. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Get session to verify user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsLoggedIn(false)
        return
      }

      // Load contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (contactError) {
        console.error('Error fetching contact submissions:', contactError)
      } else {
        setContactSubmissions(contactData || [])
      }

      // Load service inquiries
      const { data: serviceData, error: serviceError } = await supabase
        .from('service_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (serviceError) {
        console.error('Error fetching service inquiries:', serviceError)
      } else {
        setServiceSubmissions(serviceData || [])
      }

      // Load projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectError) {
        console.error('Error fetching projects:', projectError)
      } else {
        setProjects(projectData || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  // Project Management Functions
  const addProject = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          client: newProject.client,
          status: newProject.status,
          progress: parseInt(newProject.progress),
          budget: newProject.budget,
          start_date: newProject.startDate || null,
          end_date: newProject.endDate || null
        }])
        .select()

      if (error) {
        console.error('Error adding project:', error)
        alert('Error adding project: ' + error.message)
        return
      }

      setProjects([...projects, data[0]])
      setNewProject({ name: '', client: '', status: 'Planning', progress: 0, budget: '', startDate: '', endDate: '' })
      setShowAddProject(false)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while adding the project')
    }
  }

  const updateProject = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: editingProject.name,
          client: editingProject.client,
          status: editingProject.status,
          progress: parseInt(editingProject.progress),
          budget: editingProject.budget,
          start_date: editingProject.start_date || editingProject.startDate,
          end_date: editingProject.end_date || editingProject.endDate
        })
        .eq('id', editingProject.id)
        .select()

      if (error) {
        console.error('Error updating project:', error)
        alert('Error updating project: ' + error.message)
        return
      }

      const updatedProjects = projects.map(p => p.id === editingProject.id ? data[0] : p)
      setProjects(updatedProjects)
      setEditingProject(null)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while updating the project')
    }
  }

  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting project:', error)
          alert('Error deleting project: ' + error.message)
          return
        }

        setProjects(projects.filter(p => p.id !== id))
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred while deleting the project')
      }
    }
  }

  // Contact Management Functions
  const markContactAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', id)

      if (error) {
        console.error('Error updating contact:', error)
        return
      }

      const updatedSubmissions = contactSubmissions.map(submission =>
        submission.id === id ? { ...submission, status: 'read' } : submission
      )
      setContactSubmissions(updatedSubmissions)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteContactSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting contact:', error)
          return
        }

        const updatedSubmissions = contactSubmissions.filter(submission => submission.id !== id)
        setContactSubmissions(updatedSubmissions)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  // Service Management Functions
  const markServiceAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('service_inquiries')
        .update({ status: 'read' })
        .eq('id', id)

      if (error) {
        console.error('Error updating service:', error)
        return
      }

      const updatedSubmissions = serviceSubmissions.map(submission =>
        submission.id === id ? { ...submission, status: 'read' } : submission
      )
      setServiceSubmissions(updatedSubmissions)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteServiceSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this service submission?')) {
      try {
        const { error } = await supabase
          .from('service_inquiries')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error deleting service:', error)
          return
        }

        const updatedSubmissions = serviceSubmissions.filter(submission => submission.id !== id)
        setServiceSubmissions(updatedSubmissions)
      } catch (error) {
        console.error('Error:', error)
      }
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      setAdminUser(null)
      setLoginCredentials({ email: '', password: '' })
      setProjects([])
      setContactSubmissions([])
      setServiceSubmissions([])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const downloadProjectsReport = () => {
    if (projects.length === 0) {
      alert('No projects to download')
      return
    }

    // Create CSV content
    const headers = ['Project Name', 'Client', 'Status', 'Progress (%)', 'Budget', 'Start Date', 'End Date', 'Created At']
    const csvContent = [
      headers.join(','),
      ...projects.map(project => [
        `"${project.project_name || project.name || ''}"`,
        `"${project.client_name || project.client || ''}"`,
        `"${project.status || ''}"`,
        `"${project.progress || 0}"`,
        `"${project.budget || ''}"`,
        `"${project.start_date || project.startDate || ''}"`,
        `"${project.end_date || project.endDate || ''}"`,
        `"${project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}"`
      ].join(','))
    ].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `projects_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = [
    { title: 'Total Projects', value: projects.length.toString(), change: '+12%', icon: '📊' },
    { title: 'Active Clients', value: new Set(projects.map(p => p.client)).size.toString(), change: '+8%', icon: '👥' },
    { title: 'Completed Revenue', value: `₹${(projects.filter(p => p.status === 'Completed').reduce((sum, p) => {
      const budgetStr = p.budget?.toString() || '0'
      const cleanBudget = budgetStr.replace(/[₹$,\s]/g, '')
      const budgetNum = parseFloat(cleanBudget) || 0
      return sum + budgetNum
    }, 0) / 1000).toFixed(1)}K`, change: '+15%', icon: '💰' },
    { title: 'Total Revenue', value: `₹${(projects.reduce((sum, p) => {
      const budgetStr = p.budget?.toString() || '0'
      const cleanBudget = budgetStr.replace(/[₹$,\s]/g, '')
      const budgetNum = parseFloat(cleanBudget) || 0
      return sum + budgetNum
    }, 0) / 1000).toFixed(1)}K`, change: '+15%', icon: '💰' },
    { title: 'Contact Submissions', value: contactSubmissions.length.toString(), change: '+3%', icon: '📧' },
    { title: 'Service Inquiries', value: serviceSubmissions.length.toString(), change: '+5%', icon: '🏠' },
    { title: 'Unread Submissions', value: (contactSubmissions.filter(c => c.status === 'unread').length + serviceSubmissions.filter(s => s.status === 'unread').length).toString(), change: '-2%', icon: '📋' }
  ]

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}                                                                                                                            
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white hover:text-gray-200 transition-colors mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold">PrideSpan Admin Dashboard</h1>
                <p className="text-blue-100">Manage your interior design business</p>
              </div>
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
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginCredentials.email}
                    onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@pridespan.com"
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
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`w-64 bg-gray-50 border-r border-gray-200 fixed md:relative inset-y-0 left-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
              <nav className="p-4">
                <ul className="space-y-2">
                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                    { id: 'projects', name: 'Projects', icon: '🏠' },
                    { id: 'contacts', name: 'Contact Submissions', icon: '📧' },
                    { id: 'services', name: 'Service Inquiries', icon: '🔧' },
                    { id: 'settings', name: 'Settings', icon: '⚙️' }
                  ].map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id)
                          setSidebarOpen(false) // Close sidebar on mobile after selection
                        }}
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
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </nav>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              <h4 className="font-medium text-gray-900">{project.project_name || project.name}</h4>
                              <p className="text-sm text-gray-600">{project.client_name || project.client} • {project.budget}</p>
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
                      <div className="flex space-x-3">
                        <button
                          onClick={downloadProjectsReport}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Report
                        </button>
                        <button
                          onClick={() => setShowAddProject(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add New Project
                        </button>
                      </div>
                    </div>
                    
                    {/* Add Project Modal */}
                    {showAddProject && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Project</h3>
                          <form onSubmit={addProject} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  placeholder="₹0"
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
                                  value={editingProject.name || ''}
                                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                <input
                                  type="text"
                                  value={editingProject.client || ''}
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
                                <td className="py-3 px-4 font-medium">{project.project_name || project.name}</td>
                                <td className="py-3 px-4">{project.client_name || project.client}</td>
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
                                  <h4 className="font-medium text-gray-900">{submission.first_name} {submission.last_name}</h4>
                                  <p className="text-sm text-gray-600">{submission.email}</p>
                                  <p className="text-sm text-gray-600">{submission.phone}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-gray-500">{formatTimestamp(submission.created_at)}</span>
                                  {submission.status === 'unread' && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                                  )}
                                </div>
                              </div>
                              <div className="mb-3">
                                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mb-2">
                                  Project Type: {submission.project_type}
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
                                  <h4 className="font-medium text-gray-900">{submission.full_name}</h4>
                                  <p className="text-sm text-gray-600">{submission.email}</p>
                                  <p className="text-sm text-gray-600">{submission.phone}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-gray-500">{formatTimestamp(submission.created_at)}</span>
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
                              <p className="text-gray-700 mb-3">{submission.project_details}</p>
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <input
                                type="email"
                                defaultValue={adminUser?.email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Member Since
                              </label>
                              <input
                                type="text"
                                defaultValue={new Date(adminUser?.created_at).toLocaleDateString()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <button 
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Logout
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