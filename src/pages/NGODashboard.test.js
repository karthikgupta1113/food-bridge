import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NGODashboard from "./NGODashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import VolunteerListPage from "./VolunteerListPage";
import VolunteerProfilePage from "./VolunteerProfilePage";
import { getDonations, getRequests, getCurrentUser, updateRequest } from "../api";

jest.mock("../api", () => ({
  getDonations: jest.fn(),
  addRequest: jest.fn(),
  updateDonation: jest.fn(),
  getRequests: jest.fn(),
  getCurrentUser: jest.fn(),
  updateRequest: jest.fn(),
}));

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

describe("NGODashboard volunteer flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCurrentUser.mockReturnValue({ email: "hero@foodbridge.org" });
    localStorage.clear();
    localStorage.setItem(
      "fb-users",
      JSON.stringify([
        {
          id: "vol-1",
          fullName: "Ava Patel",
          email: "ava@example.com",
          phone: "9999999999",
          role: "Volunteer",
          joined: "10 Jan 2025",
          donations: 18,
          profileImage: "",
        },
      ])
    );
  });

  it("renders donations with missing status values without crashing", async () => {
    getDonations.mockResolvedValue([
      { id: 1, title: "Soup", quantity: "5", image: "", donorName: "Asha" },
    ]);

    render(
      <MemoryRouter initialEntries={["/receiver"]}>
        <Routes>
          <Route path="/receiver" element={<NGODashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Soup")).toBeInTheDocument();
    expect(screen.getByText("Available", { selector: "span" })).toBeInTheDocument();
  });

  it("renders volunteer pickups even when request data is incomplete", async () => {
    getRequests.mockResolvedValue([
      { id: 7, title: "Soup", quantity: "5", donorName: "Asha", status: undefined },
    ]);

    render(
      <MemoryRouter initialEntries={["/volunteer"]}>
        <Routes>
          <Route path="/volunteer" element={<VolunteerDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Soup")).toBeInTheDocument();
    expect(screen.getByText(/available pickups/i)).toBeInTheDocument();
  });

  it("shows accepted pickups in My Pickups when the volunteer email is inferred from the fallback hero account", async () => {
    getCurrentUser.mockReturnValue({});
    getRequests.mockResolvedValue([
      {
        id: 8,
        title: "Soup",
        quantity: "5",
        donorName: "Asha",
        status: "volunteer_assigned",
        assigned_to: "hero@foodbridge.org",
      },
    ]);

    render(
      <MemoryRouter initialEntries={["/volunteer"]}>
        <Routes>
          <Route path="/volunteer" element={<VolunteerDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /my pickups/i }));

    await waitFor(() => expect(screen.getByText("Soup")).toBeInTheDocument());
  });

  it("navigates to the volunteer list and volunteer profile pages", () => {
    getDonations.mockResolvedValue([]);
    getRequests.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/receiver"]}>
        <Routes>
          <Route path="/receiver" element={<NGODashboard />} />
          <Route path="/volunteer-list" element={<VolunteerListPage />} />
          <Route path="/volunteer-profile/:id" element={<VolunteerProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /volunteer list/i }));

    expect(screen.getByText("Volunteer Network")).toBeInTheDocument();
    expect(screen.getByText("Ava Patel")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view profile/i }));

    expect(screen.getByText(/impact summary/i)).toBeInTheDocument();
    expect(screen.getByText("Ava Patel")).toBeInTheDocument();
  });
});
