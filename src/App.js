import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from 'react';
import './index.css';
import PageNotFound from "./pages/pageNotFound";
import Landing from "./pages/landing";
import Verify from "./pages/authorized/verify";
import Signup from "./pages/authorized/signup";
import Watch from "./pages/authorized/watch";
import Series from "./pages/authorized/vod/series";
import Movie from "./pages/authorized/vod/movie";
import Search from "./pages/authorized/search";
import Account from "./pages/authorized/account";
import Movies from "./pages/authorized/movies";
import Home from "./pages/authorized/home";
import LiveTV from "./pages/authorized/livetv";
import ProtectedRoute from "./components/ProtectedRoute";
import OutOfRegion from "./pages/outOfRegion";
import routes from "./constants/routes.const";

function App() {
  return (
    <BrowserRouter basename="/play">
      <Routes>
        <Route path={routes.home} element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path={routes.movies} element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path={routes.livetv} element={<ProtectedRoute><LiveTV /></ProtectedRoute>} />
        <Route path={routes.account} element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path={routes.outOfRegion} element={<OutOfRegion />} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/vod/movie/:id" element={<ProtectedRoute><Movie /></ProtectedRoute>} />
        <Route path="/vod/series/:id" element={<ProtectedRoute><Series /></ProtectedRoute>} />
        <Route path="/watch/:type/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />

        <Route path={routes.login} element={<Signup />} />
        <Route path={routes.verifyOTP} element={<Verify />} />

        <Route path="*" element={<PageNotFound />} />
        <Route index element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
