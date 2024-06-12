import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function withAuth(Component) {
    console.log(Component)
    const AuthComponent = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const validateToken = async () => {
                const token = Cookies.get('token');
                try {
                    const response = await fetch('http://localhost:3000/api/auth/validateToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        credentials: 'include', // Asegúrate de incluir las credenciales
                    });
                    if (!response.ok) {
                        navigate('/login', { replace: true });
                    }
                } catch (error) {
                    console.error('Token validation error:', error);
                    navigate('/login', { replace: true });
                }
            };

            validateToken();
        }, [navigate]);

        return <Component {...props} />;
    };

    return AuthComponent;
}

export default withAuth;
