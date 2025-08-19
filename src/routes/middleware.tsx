import { Navigate, Outlet } from "react-router-dom";

const GuestsOnly = ({ isAuthenticated }:{ isAuthenticated: boolean }) => {
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const AuthenticatedOnly = ({ isAuthenticated }:{ isAuthenticated: boolean }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export { GuestsOnly, AuthenticatedOnly };