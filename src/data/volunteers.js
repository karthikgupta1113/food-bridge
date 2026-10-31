export const defaultVolunteers = [
  {
    id: "vol-1",
    fullName: "Ava Patel",
    email: "ava@example.com",
    phone: "9999999999",
    joined: "10 Jan 2025",
    donations: 18,
    role: "Volunteer",
    impact: "Delivered 18 food packs and supported 6 community drives.",
    profileImage: "",
  },
  {
    id: "vol-2",
    fullName: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "8888888888",
    joined: "02 Feb 2025",
    donations: 12,
    role: "Volunteer",
    impact: "Coordinated 12 pickups and helped 3 NGOs receive urgent supplies.",
    profileImage: "",
  },
  {
    id: "vol-3",
    fullName: "Sara Ali",
    email: "sara@example.com",
    phone: "7777777777",
    joined: "15 Mar 2025",
    donations: 21,
    role: "Volunteer",
    impact: "Led weekend food drives and boosted donor engagement by 25%.",
    profileImage: "",
  },
];

export const getVolunteerData = () => {
  const storedUsers = localStorage.getItem("fb-users");

  if (!storedUsers) {
    return defaultVolunteers;
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);
    const volunteerUsers = parsedUsers.filter((user) => user.role === "Volunteer");
    return volunteerUsers.length > 0 ? volunteerUsers : defaultVolunteers;
  } catch (error) {
    console.error("Failed to load volunteers", error);
    return defaultVolunteers;
  }
};

export const getVolunteerById = (id) => {
  const volunteers = getVolunteerData();
  return volunteers.find((volunteer) => String(volunteer.id) === String(id)) || null;
};
