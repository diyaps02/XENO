import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          const userData = await response.json()
          if (userData.companyName && userData.role) {
            setIsAuthenticated(true)
          } else {
            // Redirect to Google login with redirect param set to current path
            window.location.href = `http://localhost:3000/auth/google?redirect=${encodeURIComponent(
              window.location.pathname
            )}`
          }
        } else {
          navigate("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? children : null
}

export default AuthWrapper
