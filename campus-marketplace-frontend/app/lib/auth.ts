export async function checkAuth() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const res = await fetch(`${API}/auth/me`, {
      credentials: 'include',
    });
    
    if (res.ok) {
      const user = await res.json();
      return { isLoggedIn: true, user };
    }
    return { isLoggedIn: false, user: null };
  } catch (error) {
    return { isLoggedIn: false, user: null };
  }
}

export async function logout() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}