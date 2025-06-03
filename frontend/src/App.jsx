import React, { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/login"
import Profile from "./pages/profile"
import Dashboard from "./pages/dashboard"
import SegmentCreate from "./pages/segmentcreate"
import SegmentList from "./pages/segmentlist"
import CampaignCreate from "./pages/campaigncreate"
import CampaignList from "./pages/campaignlist"
import CampaignDetail from "./pages/campaigndetails"
import AuthWrapper from "./Components/AuthWrapper"
import CsvUploadForm from "./pages/csvupload"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          }
        />
        <Route
          path="/segments"
          element={
            <AuthWrapper>
              <SegmentList />
            </AuthWrapper>
          }
        />
        <Route
          path="/segments/create"
          element={
            <AuthWrapper>
              <SegmentCreate />
            </AuthWrapper>
          }
        />
        <Route
          path="/campaigns"
          element={
            <AuthWrapper>
              <CampaignList />
            </AuthWrapper>
          }
        />
        <Route
          path="/campaigns/create"
          element={
            <AuthWrapper>
              <CampaignCreate />
            </AuthWrapper>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <AuthWrapper>
              <CampaignDetail />
            </AuthWrapper>
          }
        />
        <Route path="/upload-csv" element={<CsvUploadForm />} />
      </Routes>
    </div>
  )
}

export default App
