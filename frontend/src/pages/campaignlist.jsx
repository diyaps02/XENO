import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
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

          // Get campaigns
          const campaignsResponse = await fetch(`http://localhost:3000/api/v1/campaign/all?email=${userData.email}`)
          const campaignsData = await campaignsResponse.json()
          setCampaigns(campaignsData.campaigns || [])
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/v1/campaign/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCampaigns(campaigns.filter((campaign) => campaign._id !== id))
      } else {
        alert("Failed to delete campaign")
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error)
      alert("Failed to delete campaign")
    }
  }

  const handleSend = async (id) => {
    if (!confirm("Are you sure you want to send this campaign?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/v1/campaign/${id}/send`, {
        method: "POST",
      })

      if (response.ok) {
        // Refresh campaigns list
        const campaignsResponse = await fetch(`http://localhost:3000/api/v1/campaign/all?email=${user.email}`)
        const campaignsData = await campaignsResponse.json()
        setCampaigns(campaignsData.campaigns || [])
      } else {
        alert("Failed to send campaign")
      }
    } catch (error) {
      console.error("Failed to send campaign:", error)
      alert("Failed to send campaign")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign History</h1>
            <p className="text-gray-600 mt-2">View and manage your marketing campaigns.</p>
          </div>
          <Link to="/campaigns/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Create New Campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first campaign.</p>
            <div className="mt-6">
              <Link
                to="/campaigns/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Campaign
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <li key={campaign._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
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

                        <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                          <span>Segment: {campaign.segmentId?.name || "Unknown"}</span>
                          <span>Audience: {campaign.audienceSize} customers</span>
                          <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                          {campaign.sentAt && <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>}
                        </div>

                        {campaign.status === "Sent" && (
                          <div className="mt-2 flex items-center text-sm space-x-4">
                            <span className="text-green-600">✓ Sent: {campaign.sentCount}</span>
                            <span className="text-red-600">✗ Failed: {campaign.failedCount}</span>
                            <span className="text-gray-600">
                              Success Rate: {Math.round((campaign.sentCount / campaign.audienceSize) * 100)}%
                            </span>
                          </div>
                        )}

                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">{campaign.message}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Link
                          to={`/campaigns/${campaign._id}`}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          View Details
                        </Link>
                        {campaign.status === "Draft" && (
                          <button
                            onClick={() => handleSend(campaign._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Send Now
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(campaign._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignList
