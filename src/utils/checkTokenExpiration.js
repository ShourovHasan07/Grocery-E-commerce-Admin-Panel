
import { isJWT, parseJWT } from './helpers';

// Utility function to check if external API token is valid
export const checkTokenExpiration = async (session) => {
  // Check if session is available
  if (!session || !session?.accessToken) {
    return { isValid: false, reason: 'No session found' };
  }

  // Check if session is valid
  try {
    // Get the token from session (adjust based on your session structure)
    const apiToken = session?.accessToken;

    if (!apiToken) {
      return { isValid: false, reason: 'No API token found' };
    }

    // Method 1: Check token expiration from JWT payload (if it's a JWT)
    if (isJWT(apiToken)) {
      const payload = parseJWT(apiToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        return { isValid: false, reason: 'Token expired' };
      }
    }

    // Method 2: Make a verification request to your external API
    const response = await fetch(`${process.env.API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        isValid: false,
        reason: response.status === 401 ? 'Token expired or invalid' : 'API error'
      };
    }

    return { isValid: true };

  } catch (error) {
    // console.error('Token validation error:', error);

    return { isValid: false, reason: 'Validation failed' };
  }

}
