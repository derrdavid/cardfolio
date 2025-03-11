import jwtDecode from 'jwt-decode';

export const getTokenExpiration = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000; 
    } catch (error) {
        console.error('Token konnte nicht decodiert werden:', error);
        return null;
    }
}