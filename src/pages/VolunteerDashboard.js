import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, getRequests, updateRequest } from "../api";
import "../styles/VolunteerDashboard.css";

const STATUS_STEPS = ["volunteer_assigned", "picked_up", "delivering", "delivered"];
const DEFAULT_PICKUP = { lat: 17.6900, lng: 83.2182 };
const DEFAULT_DROPOFF = { lat: 17.7062, lng: 83.2926 };
export const DEFAULT_ORIGIN_ADDRESS = "Vignan's Institute of Information Technology, Duvvada, Visakhapatnam, Andhra Pradesh 530049";

export const getRouteOrigin = (currentLocation) => {
  if (currentLocation && typeof currentLocation.lat === "number" && typeof currentLocation.lng === "number") {
    return `${currentLocation.lat},${currentLocation.lng}`;
  }
  return DEFAULT_ORIGIN_ADDRESS;
};

const normalizeRequest = (request) => {
  const status = (request?.status || "accepted").toString().trim().toLowerCase();
  const quantityValue = Number.parseInt(request?.quantity ?? request?.serves, 10);

  return {
    id: request?.id,
    food_name: request?.title || request?.foodName || "Food pickup",
    donor_name: request?.donorName || "Donor partner",
    ngo_name: request?.ngo_name || request?.ngoName || request?.source || "NGO recipient",
    quantity: request?.quantity || request?.serves || "N/A",
    pickup_address: request?.address || request?.location || "Pickup address not provided",
    dropoff_address:
      request?.dropoff_address || request?.dropoffAddress || "Delivery location not provided",
    pickup_time: request?.pickup_time || request?.pickupTime || "ASAP",
    distance_km: typeof request?.distance_km === "number" ? request.distance_km : null,
    reward_points: request?.reward_points ?? 20,
    status: status || "accepted",
    assigned_to: request?.assigned_to || request?.assignedTo || null,
    pickup_location: request?.pickup_location || DEFAULT_PICKUP,
    dropoff_location: request?.dropoff_location || DEFAULT_DROPOFF,
    request_data: request,
    meals_saved: Number.isFinite(quantityValue) && quantityValue > 0 ? quantityValue : 10,
  };
};

const geocodeCache = {};
const geocodeAddress = async (address) => {
  if (!address) return null;
  const normalized = address.trim();
  if (!normalized) return null;
  if (geocodeCache[normalized]) return geocodeCache[normalized];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        normalized
      )}`
    );
    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }
    const location = {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
    };
    geocodeCache[normalized] = location;
    return location;
  } catch (error) {
    console.warn("Geocoding failed for", normalized, error);
    return null;
  }
};

const computeDistanceKm = (origin, destination) => {
  if (!origin || !destination) return null;
  const toRad = (value) => (value * Math.PI) / 180;
  const lat1 = origin.lat;
  const lon1 = origin.lng;
  const lat2 = destination.lat;
  const lon2 = destination.lng;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const earthRadiusKm = 6371;
  return parseFloat((earthRadiusKm * c).toFixed(1));
};

const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        navigator.geolocation.clearWatch(id);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        navigator.geolocation.clearWatch(id);
        resolve(null);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 }
    );
  });

const calculateStats = (requests) => {
  const total = requests.length;
  const delivered = requests.filter((item) => item.status === "delivered").length;
  const meals_saved = requests.reduce((sum, item) => sum + (item.meals_saved || 10), 0);
  const points = total * 100 + delivered * 75;
  const rating = total > 0 ? 4.8 + Math.min(total * 0.01, 0.2) : 4.8;
  return {
    total_pickups: total,
    meals_saved,
    rating,
    points,
  };
};

export default function VolunteerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("opportunities");
  const [stats, setStats] = useState({ total_pickups: 0, meals_saved: 0, rating: 4.8, points: 0 });
  const [opportunities, setOpportunities] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser() || {};
  const email = currentUser.email || location?.state?.email || "hero@foodbridge.org";
  const volunteerEmail = (currentUser.email || email || "").toLowerCase() || null;

  const loadRequests = useCallback(async () => {
    const stored = await getRequests();
    const currentLocation = await getCurrentLocation();
    const normalized = await Promise.all(
      (Array.isArray(stored) ? stored : []).map(async (request) => {
        const item = normalizeRequest(request);

        if (!item.pickup_location && item.pickup_address) {
          item.pickup_location = await geocodeAddress(item.pickup_address);
        }
        if (!item.dropoff_location && item.dropoff_address) {
          item.dropoff_location = await geocodeAddress(item.dropoff_address);
        }

        if (
          item.pickup_location &&
          item.dropoff_location &&
          (item.distance_km === null || item.distance_km === 0)
        ) {
          item.distance_km = computeDistanceKm(item.pickup_location, item.dropoff_location);
        }

        if (currentLocation && item.pickup_location) {
          item.live_distance_km = computeDistanceKm(currentLocation, item.pickup_location);
          item.live_eta_minutes = item.live_distance_km
            ? Math.max(5, Math.round((item.live_distance_km / 30) * 60))
            : null;
        } else {
          item.live_distance_km = null;
          item.live_eta_minutes = null;
        }

        return item;
      })
    );

    const openRequests = normalized.filter(
      (item) => (item.status === "accepted" || item.status === "requested") && !item.assigned_to
    );
    const assignedRequests = normalized.filter(
      (item) =>
        volunteerEmail &&
        item.assigned_to &&
        item.assigned_to.toLowerCase() === volunteerEmail
    );

    setStats(calculateStats(assignedRequests));
    setOpportunities(openRequests);
    setMyPickups(assignedRequests);
  }, [volunteerEmail]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await loadRequests();
      } catch (error) {
        console.error("Failed to load volunteer dashboard", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [loadRequests]);

  const handleAccept = async (id) => {
    try {
      const assignedVolunteer = currentUser.email || email;
      const matchingOpportunity = opportunities.find((item) => String(item.id) === String(id));

      if (matchingOpportunity) {
        setMyPickups((prev) => [
          {
            ...matchingOpportunity,
            status: "volunteer_assigned",
            assigned_to: assignedVolunteer,
          },
          ...prev,
        ]);
        setOpportunities((prev) => prev.filter((item) => String(item.id) !== String(id)));
      }

      await updateRequest(id, {
        status: "volunteer_assigned",
        assigned_to: assignedVolunteer,
      });
      await loadRequests();
      setTab("active");
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      setMyPickups((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? { ...item, status: nextStatus } : item))
      );

      await updateRequest(id, { status: nextStatus });
      await loadRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const openProfile = () => {
    navigate("/profile");
  };

  const openRoute = (item) => {
    const destination =
      item.pickup_address ||
      item.address ||
      item.location ||
      (item.pickup_location ? `${item.pickup_location.lat},${item.pickup_location.lng}` : "");

    if (!destination) {
      window.alert("Cannot open route because the donor pickup address is missing.");
      return;
    }

    const buildRouteLink = (origin) => {
      const params = new URLSearchParams({
        api: "1",
        origin,
        destination,
        travelmode: "driving",
      });
      return `https://www.google.com/maps/dir/?${params.toString()}`;
    };

    // Open a blank window synchronously to avoid popup blockers in Safari
    let newWin = null;
    try {
      newWin = window.open('about:blank', '_blank');
    } catch (e) {
      newWin = null;
    }
    const blocked = !newWin;

    const openWithOrigin = (origin) => {
      const routeLink = buildRouteLink(origin);
      if (!blocked && newWin) {
        try {
          newWin.location.href = routeLink;
          newWin.focus();
        } catch (e) {
          // fallback
          window.open(routeLink, '_blank', 'noreferrer');
        }
      } else {
        // Popup blocked: copy link to clipboard and show prompt so user can open manually
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(routeLink);
          }
        } catch (e) {}
        window.prompt('Popup blocked — copy this link and open in a new tab:', routeLink);
      }
    };

    // Try to get a more accurate current position by sampling multiple readings
    const getAccurateCurrentPosition = (maxWait = 8000, desiredAccuracy = 30) =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation unavailable"));
        let best = null;
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;
            if (pos.coords.accuracy <= desiredAccuracy) {
              navigator.geolocation.clearWatch(id);
              return resolve(pos);
            }
          },
          (err) => {
            try { navigator.geolocation.clearWatch(id); } catch (e) {}
            reject(err);
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );

        setTimeout(() => {
          try { navigator.geolocation.clearWatch(id); } catch (e) {}
          if (best) return resolve(best);
          reject(new Error("Timed out getting position"));
        }, maxWait);
      });

    if (navigator.geolocation) {
      getAccurateCurrentPosition(8000, 30)
        .then((position) => {
          const origin = `${position.coords.latitude},${position.coords.longitude}`;
          openWithOrigin(origin);
        })
        .catch(() => {
          openWithOrigin(DEFAULT_ORIGIN_ADDRESS);
        });
    } else {
      openWithOrigin(DEFAULT_ORIGIN_ADDRESS);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container volunteer-loading">
        <div className="loading-panel">Loading Volunteer dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container volunteer-dashboard-root">
      <header className="dashboard-header">
        <div>
          <h1>Volunteer Hero Portal</h1>
          <p className="volunteer-subtitle">Your accepted donations appear here automatically.</p>
        </div>
        <div className="rank-badge profile-badge" onClick={openProfile} role="button" tabIndex={0} onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfile();
          }
        }}>
          <div className="profile-avatar">👤</div>
          <div>
            <div className="profile-badge-title">{currentUser.fullName || currentUser.full_name || email.split("@")[0]}</div>
            <div className="profile-badge-subtitle">{email}</div>
          </div>
        </div>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="card-icon">🚚</div>
          <div className="card-info">
            <h3>Total Pickups</h3>
            <p>{stats.total_pickups}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-icon">🍱</div>
          <div className="card-info">
            <h3>Meals Saved</h3>
            <p>{stats.meals_saved}</p>
          </div>
        </div>
        <div className="metric-card gold-card">
          <div className="card-icon">⭐</div>
          <div className="card-info">
            <h3>Rating</h3>
            <p>{stats.rating.toFixed(1)}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="card-icon">⚡</div>
          <div className="card-info">
            <h3>Hero Points</h3>
            <p>{stats.points}</p>
          </div>
        </div>
      </section>

      <div className="tab-bar">
        <button className={`tab-button ${tab === "opportunities" ? "active" : ""}`} onClick={() => setTab("opportunities")}>Available Pickups</button>
        <button className={`tab-button ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")}>My Pickups</button>
        <button className={`tab-button ${tab === "impact" ? "active" : ""}`} onClick={() => setTab("impact")}>My Impact</button>
      </div>

      {tab === "opportunities" && (
        <section className="hero-grid">
          {opportunities.length === 0 ? (
            <div className="empty-state">No new volunteer pickups available yet.</div>
          ) : (
            opportunities.map((item) => (
              <div key={item.id} className="opportunity-card">
                <div className="opportunity-header">
                  <div>
                    <h3>{item.food_name}</h3>
                    <p className="muted">{item.quantity} · {item.donor_name}</p>
                  </div>
                  <span className="badge-small">
                    {item.live_distance_km ? `${item.live_distance_km.toFixed(1)} km` : item.distance_km ? `${item.distance_km.toFixed(1)} km` : "—"}
                  </span>
                </div>
                <div className="opportunity-details">
                  <div><strong>Pickup:</strong> {item.pickup_address}</div>
                  <div><strong>Delivery:</strong> {item.dropoff_address}</div>
                  <div><strong>Live ETA:</strong> {item.live_eta_minutes ? `~${item.live_eta_minutes} min` : "Tracking unavailable"}</div>
                  <div><strong>Time:</strong> {item.pickup_time}</div>
                </div>
                <div className="opportunity-actions">
                  <button className="btn-secondary" onClick={() => openRoute(item)}>Open in Maps</button>
                  <button className="btn-primary" onClick={() => handleAccept(item.id)}>Accept Pickup</button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {tab === "active" && (
        <section className="hero-grid">
          {myPickups.length === 0 ? (
            <div className="empty-state">No active pickups yet. Accept one from Browse Donations.</div>
          ) : (
            myPickups.map((item) => {
              const currentStep = STATUS_STEPS.indexOf(item.status);
              const nextStatus = STATUS_STEPS[currentStep + 1];
              return (
                <div key={item.id} className="opportunity-card">
                  <div className="opportunity-header">
                    <div>
                      <h3>{item.food_name}</h3>
                      <p className="muted">{item.donor_name} → {item.ngo_name}</p>
                    </div>
                    <span className="badge-small status-badge">{item.status.replace("_", " ")}</span>
                  </div>

                  <div className="opportunity-details">
                    <div><strong>Pickup:</strong> {item.pickup_address}</div>
                    <div><strong>Dropoff:</strong> {item.dropoff_address}</div>
                    <div>
                      <strong>Live distance:</strong> {item.live_distance_km ? `${item.live_distance_km.toFixed(1)} km` : item.distance_km ? `${item.distance_km.toFixed(1)} km` : "Pending"}
                    </div>
                    <div>
                      <strong>ETA:</strong> {item.live_eta_minutes ? `~${item.live_eta_minutes} min` : "Pending"}
                    </div>
                  </div>

                  <div className="progress-steps">
                    {STATUS_STEPS.map((statusLabel, idx) => (
                      <div key={statusLabel} className={`step-pill ${idx === currentStep ? "step-active" : idx < currentStep ? "step-complete" : ""}`}>
                        {statusLabel.replace("_", " ")}
                      </div>
                    ))}
                  </div>

                  <div className="opportunity-actions">
                    <button className="btn-secondary" onClick={() => openRoute(item)}>Open in Maps</button>
                    {nextStatus ? (
                      <button className="btn-primary" onClick={() => handleStatusUpdate(item.id, nextStatus)}>
                        {`Mark as ${nextStatus.replace("_", " ")}`}
                      </button>
                    ) : (
                      <div className="completed-banner">Completed</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {tab === "impact" && (
        <section className="impact-panel">
          <div className="impact-card">
            <h2>Meals Saved</h2>
            <p>{stats.meals_saved}</p>
          </div>
          <div className="impact-card">
            <h2>Hero Points</h2>
            <p>{stats.points}</p>
          </div>
          <div className="impact-card">
            <h2>Rating</h2>
            <p>{stats.rating.toFixed(1)}</p>
          </div>
          <div className="impact-card">
            <h2>Completed Pickups</h2>
            <p>{myPickups.filter((item) => item.status === "delivered").length}</p>
          </div>

          <div className="badges-panel">
            {[
              { title: "First Pickup", earned: stats.total_pickups >= 1 },
              { title: "10 Meals Saved", earned: stats.meals_saved >= 10 },
              { title: "100 Meals Saved", earned: stats.meals_saved >= 100 },
              { title: "Eco Hero", earned: stats.points >= 200 },
            ].map((badge) => (
              <div key={badge.title} className={`badge-card ${badge.earned ? "badge-earned" : "badge-locked"}`}>
                <div>{badge.title}</div>
                <div>{badge.earned ? "Earned" : "Locked"}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
