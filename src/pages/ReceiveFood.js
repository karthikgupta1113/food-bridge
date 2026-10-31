import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { addRequest, getDonations, updateDonation } from "../api";

function ReceiveFood() {
  const [donations, setDonations] = useState([]);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const loadDonations = async () => {
    try {
      const items = await getDonations();
      setDonations(items.filter((item) => item.status === "Available"));
    } catch (error) {
      setNoticeType("error");
      setNotice(error.message || "Unable to load donations.");
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const foods = donations.map((item) => ({
    ...item,
    name: item.title || item.foodName || "Unnamed food",
    quantity: item.quantity || item.serves || "N/A",
    location: item.address || item.location || "Unknown",
    image:
      item.image ||
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
  }));

  const handleAcceptDonation = async (food) => {
    try {
      await updateDonation(String(food.id), { status: "Accepted" });
      await addRequest({
        id: Date.now().toString(),
        donationId: food.id,
        title: food.title || food.foodName || food.name,
        quantity: food.quantity || food.serves || "N/A",
        status: "Accepted",
        image: food.image || "",
        donorName: food.donorName || "Unknown Donor",
        category: food.category || "",
        address: food.address || food.location || "",
        pickup_address: food.address || food.location || "",
        pickup_time: food.pickup_time || food.pickupTime || "ASAP",
        dropoff_address: food.dropoff_address || food.dropoffAddress || "Recipient location pending",
        ngo_name: food.ngo_name || food.ngoName || "NGO Request",
        acceptedAt: new Date().toISOString(),
        source: "Browse Donations",
        assigned_to: null,
      });
      await loadDonations();
      setNoticeType("success");
      setNotice("Donation accepted and sent to the volunteer portal.");
    } catch (error) {
      setNoticeType("error");
      setNotice(error.message || "Unable to accept donation.");
    }
  };

  const handleDeclineDonation = async (food) => {
    try {
      await updateDonation(String(food.id), { status: "Declined" });
      await loadDonations();
      setNoticeType("info");
      setNotice("Donation declined.");
    } catch (error) {
      setNoticeType("error");
      setNotice(error.message || "Unable to decline donation.");
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          padding: "40px",
          backgroundImage: "url('../assets/bagg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "40px",
          }}
        >
          🥗 Available food donations 🥗
        </h1>

        {notice && (
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto 24px",
              padding: "14px 18px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: 600,
              background:
                noticeType === "success"
                  ? "rgba(34, 197, 94, 0.15)"
                  : noticeType === "error"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(59, 130, 246, 0.15)",
              color:
                noticeType === "success"
                  ? "#166534"
                  : noticeType === "error"
                  ? "#991b1b"
                  : "#1d4ed8",
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
            }}
          >
            {notice}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "25px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {foods.length === 0 ? (
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "rgba(247,250,252,0.95)",
                color: "#0f172a",
                padding: "30px",
                borderRadius: "18px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
              }}
            >
              <h2>No donations available yet</h2>
              <p>Please check back later or ask donors to post food donations.</p>
            </div>
          ) : (
            foods.map((food) => (
              <div
                key={food.id}
                style={{
                  width: "300px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  color: "#0f172a",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0px 10px 20px rgba(15,23,42,0.1)",
                }}
              >
                <h2 style={{ marginTop: 0 }}>{food.name}</h2>
                <img
                  src={food.image}
                  alt={food.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />

                <p style={{ margin: "6px 0" }}>
                  <strong>Quantity:</strong> {food.quantity}
                </p>
                {food.category && (
                  <p style={{ margin: "6px 0" }}>
                    <strong>Category:</strong> {food.category}
                  </p>
                )}
                {food.address && (
                  <p style={{ margin: "6px 0" }}>
                    <strong>Pickup:</strong> {food.address}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() => handleAcceptDonation(food)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#1d4ed8",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineDonation(food)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#d97706",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ReceiveFood;
