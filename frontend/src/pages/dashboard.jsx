import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSegments: 0,
    totalCampaigns: 0,
    recentCampaigns: [],
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user profile
        const userResponse = await fetch("http://localhost:3000/users/profile", {
          credentials: "include",
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)

          // Get segments
          const segmentsResponse = await fetch("http://localhost:3000/api/v1/segment/all")
          const segmentsData = await segmentsResponse.json()

          // Get campaigns
          const campaignsResponse = await fetch(`http://localhost:3000/api/v1/campaign/all?email=${userData.email}`)
          const campaignsData = await campaignsResponse.json()

          setStats({
            totalSegments: segmentsData.segments?.length || 0,
            totalCampaigns: campaignsData.campaigns?.length || 0,
            recentCampaigns: campaignsData.campaigns?.slice(0, 5) || [],
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.displayName}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your campaigns today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Segments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSegments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">90%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/segments/create"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded"
              >
                Create New Segment
              </Link>
              <Link
                to="/campaigns/create"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded"
              >
                Create New Campaign
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Campaigns</h3>
            <div className="space-y-3">
              {stats.recentCampaigns.length > 0 ? (
                stats.recentCampaigns.map((campaign) => (
                  <div key={campaign._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        campaign.status === "Sent"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No campaigns yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
