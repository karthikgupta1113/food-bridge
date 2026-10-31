const CURRENT_USER_KEY = "fb-current-user";
const LOCAL_USER_KEY = "user";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const getLocalCurrentUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const storeLocalCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  return user;
};

const clearLocalCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(LOCAL_USER_KEY);
};

export const normalizeRole = (role) => {
  if (!role) return "Donor";

  const normalized = String(role).trim().toLowerCase();
  if (["donor", "donate", "donation"].includes(normalized)) return "Donor";
  if (["ngo", "receiver", "recipient", "charity", "organization"].includes(normalized)) return "Receiver";
  if (["hero", "volunteer", "food hero", "worker"].includes(normalized)) return "Volunteer";

  return String(role).trim();
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

export const register = async (userData) => {
  const normalizedUserData = {
    ...userData,
    role: normalizeRole(userData?.role),
  };

  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(normalizedUserData),
  });
  storeLocalCurrentUser(data.user);
  return data;
};

export const login = async (email, password, role) => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role: normalizeRole(role) }),
  });
  storeLocalCurrentUser(response.user);
  return response;
};

export const loginWithGoogle = async (email, role) => {
  const data = await request("/api/auth/social-login", {
    method: "POST",
    body: JSON.stringify({ email, role: normalizeRole(role), provider: "Google" }),
  });
  storeLocalCurrentUser(data.user);
  return data;
};

export const loginWithFacebook = async (email, role) => {
  const data = await request("/api/auth/social-login", {
    method: "POST",
    body: JSON.stringify({ email, role: normalizeRole(role), provider: "Facebook" }),
  });
  storeLocalCurrentUser(data.user);
  return data;
};

export const logout = async () => {
  try {
    await request("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.warn("Logout request failed, clearing local session anyway.", error);
  } finally {
    clearLocalCurrentUser();
  }
};

export const getCurrentUser = () => {
  return getLocalCurrentUser();
};

export const updateProfile = async (updates) => {
  const currentUser = getLocalCurrentUser();
  if (!currentUser) {
    throw new Error("No logged in user.");
  }
  const payload = {
    ...updates,
    email: currentUser.email,
  };
  const data = await request("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  storeLocalCurrentUser(data.user);
  return data;
};

export const getDonations = async () => {
  try {
    const data = await request("/api/donations");
    return Array.isArray(data?.donations) ? data.donations : [];
  } catch (error) {
    return [];
  }
};

export const addDonation = async (donation) => {
  const currentUser = getLocalCurrentUser();
  const payload = {
    ...donation,
    email: currentUser?.email,
  };
  const data = await request("/api/donations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.donation;
};

export const updateDonation = async (id, updates) => {
  const data = await request(`/api/donations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.donation;
};

export const getRequests = async () => {
  try {
    const data = await request("/api/requests");
    return Array.isArray(data?.requests) ? data.requests : [];
  } catch (error) {
    return [];
  }
};

export const addRequest = async (requestBody) => {
  const data = await request("/api/requests", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
  return data.request;
};

export const updateRequest = async (id, updates) => {
  try {
    const data = await request(`/api/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (data?.request) {
      return data.request;
    }
  } catch (error) {
    console.warn("Request update call failed, using local fallback.", error);
  }

  return {
    id,
    ...updates,
  };
};
