import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import Home from './pages/Home';
import Features from './pages/Features';
import Academic from './pages/Academic';
import Business from './pages/Business';
import Listings from './pages/Listings';
import SeedDetail from './pages/SeedDetail';
import NeedDetail from './pages/NeedDetail';
import AcademicDashboard from './pages/AcademicDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import NewProposal from './pages/NewProposal';
import EditProposal from './pages/EditProposal';
import AcademicMessages from './pages/AcademicMessages';
import BusinessMessages from './pages/BusinessMessages';
import AcademicProjects from './pages/AcademicProjects';
import BusinessProjects from './pages/BusinessProjects';
import FundingNews from './pages/FundingNews';
import ResearcherSearch from './pages/ResearcherSearch';
import AiChatPopup from './components/AiChatPopup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <SideMenu />
        <main className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/business" element={<Business />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/academic/proposals/:id" element={<SeedDetail />} />
            <Route path="/needs/:id" element={<NeedDetail />} />
            <Route path="/academic/dashboard" element={<AcademicDashboard />} />
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/academic/proposals/new" element={<NewProposal />} />
            <Route path="/academic/proposals/edit/:id" element={<EditProposal />} />
            <Route path="/messages/academic" element={<AcademicMessages />} />
            <Route path="/messages/business" element={<BusinessMessages />} />
            <Route path="/projects/academic" element={<AcademicProjects />} />
            <Route path="/projects/business" element={<BusinessProjects />} />
            <Route path="/funding" element={<FundingNews />} />
            <Route path="/researcher-search" element={<ResearcherSearch />} />
          </Routes>
        </main>
        {/* AIチャット用ポップアップ */}
        <AiChatPopup />
      </div>
    </Router>
  );
}

export default App;
