import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from "../contexts/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    return (
        auth.success ? children : <Navigate to="/login"/>
    );
};

export default PrivateRoute;
