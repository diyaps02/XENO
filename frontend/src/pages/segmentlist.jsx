import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"

const SegmentList = () => {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/segment/all")
        const data = await response.json()
        setSegments(data.segments || [])
      } catch (error) {
        console.error("Failed to fetch segments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSegments()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this segment?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/v1/segment/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSegments(segments.filter((segment) => segment._id !== id))
      } else {
        alert("Failed to delete segment")
      }
    } catch (error) {
      console.error("Failed to delete segment:", error)
      alert("Failed to delete segment")
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
            <h1 className="text-3xl font-bold text-gray-900">Customer Segments</h1>
            <p className="text-gray-600 mt-2">Manage your customer segments and create targeted campaigns.</p>
          </div>
          <Link to="/segments/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Create New Segment
          </Link>
        </div>

        {segments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No segments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first customer segment.</p>
            <div className="mt-6">
              <Link
                to="/segments/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Segment
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {segments.map((segment) => (
                <li key={segment._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{segment.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            Audience: {segment.audienceSize || 0} customers
                          </span>
                          <span className="ml-4">Created: {new Date(segment.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">{segment.criteria}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/campaigns/create?segmentId=${segment._id}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Create Campaign
                        </Link>
                        <button
                          onClick={() => handleDelete(segment._id)}
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

export default SegmentList
