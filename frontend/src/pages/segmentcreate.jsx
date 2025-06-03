import React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Components/Navbar"
import RuleBuilder from "../Components/RuleBuilder"

const SegmentCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: "",
  })
  const [audienceSize, setAudienceSize] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useState(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://mini-messager04.onrender.com/users/profile", {
          credentials: "include",
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser()
  }, [])

  const handleRulesChange = (criteria) => {
    setFormData({ ...formData, criteria })
    // Do not trigger handlePreview here
  }

  const handlePreview = async () => {
    if (!formData.criteria || !user?.email) return

    setLoading(true)
    try {
      const response = await fetch("https://mini-messager04.onrender.com/api/v1/segment/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          criteria: formData.criteria,
          email: user.email,
        }),
      })

      const data = await response.json()
      console.log("Audience size preview:", data);

      setAudienceSize(data.audienceSize)
    } catch (error) {
      console.error("Failed to preview audience:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.criteria || !user?.email) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://mini-messager04.onrender.com/api/v1/segment/create", {
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
        navigate("/segments")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create segment")
      }
    } catch (error) {
      console.error("Failed to create segment:", error)
      alert("Failed to create segment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Segment</h1>
          <p className="text-gray-600 mt-2">
            Define rules to segment your customers based on their behavior and attributes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Segment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Segment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., High Value Customers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this segment"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <RuleBuilder onRulesChange={handleRulesChange} onPreview={handlePreview} />

            {audienceSize !== null && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>Audience Size:</strong> {audienceSize} customers match these criteria
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/segments")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Segment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SegmentCreate
