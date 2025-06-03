import React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Navbar from "../Components/Navbar"

const CampaignCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    segmentId: "",
    message: "",
  })
  const [segments, setSegments] = useState([])
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
        }

        // Get segments
        const segmentsResponse = await fetch("http://localhost:3000/api/v1/segment/all")
        const segmentsData = await segmentsResponse.json()
        setSegments(segmentsData.segments || [])

        // Pre-select segment if provided in URL
        const segmentId = searchParams.get("segmentId")
        if (segmentId) {
          setFormData((prev) => ({ ...prev, segmentId }))
          const segment = segmentsData.segments?.find((s) => s._id === segmentId)
          setSelectedSegment(segment)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [searchParams])

  const handleSegmentChange = (segmentId) => {
    setFormData({ ...formData, segmentId })
    const segment = segments.find((s) => s._id === segmentId)
    setSelectedSegment(segment)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.segmentId || !formData.message || !user?.email) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/v1/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: user.email,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Optionally send the campaign immediately
        if (confirm("Campaign created! Do you want to send it now?")) {
          await fetch(`http://localhost:3000/api/v1/campaign/${data.campaign._id}/send`, {
            method: "POST",
          })
        }
        navigate("/campaigns")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create campaign")
      }
    } catch (error) {
      console.error("Failed to create campaign:", error)
      alert("Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Send targeted messages to your customer segments.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Sale Campaign"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Segment</label>
                <select
                  value={formData.segmentId}
                  onChange={(e) => handleSegmentChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a segment</option>
                  {segments.map((segment) => (
                    <option key={segment._id} value={segment._id}>
                      {segment.name} ({segment.audienceSize || 0} customers)
                    </option>
                  ))}
                </select>

                {selectedSegment && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Selected Segment:</strong> {selectedSegment.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{selectedSegment.description}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Audience Size: {selectedSegment.audienceSize || 0} customers
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hi [Name], we have a special offer just for you..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use [Name] to personalize the message with customer names.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/campaigns")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CampaignCreate
