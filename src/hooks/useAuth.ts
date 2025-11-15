const login = async (authData: any) => {
  if (!authData.access_token) return;

  localStorage.setItem('vk_access_token', authData.access_token);

  try {
    const res = await fetch('/api/auth/vk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData),
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
  } catch (err) {
    console.error('Login failed:', err);
  }
};
