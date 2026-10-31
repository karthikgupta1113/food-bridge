import { getDonations, getRequests, login, updateRequest } from "./api";

describe("seeded dashboard data fallback", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns an empty list when the backend returns no donations", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ donations: [] }),
    });

    const donations = await getDonations();

    expect(Array.isArray(donations)).toBe(true);
    expect(donations).toEqual([]);
  });

  it("returns an empty list when the backend returns no requests", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ requests: [] }),
    });

    const requests = await getRequests();

    expect(Array.isArray(requests)).toBe(true);
    expect(requests).toEqual([]);
  });

  it("returns no local request when the backend omits the updated row", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ requests: [] }),
    });

    const updated = await updateRequest(501, { status: "picked_up" });

    expect(updated).toMatchObject({ id: 501, status: "picked_up" });

    const requests = await getRequests();
    expect(requests.find((request) => request.id === 501)).toBeUndefined();
  });

  it("normalizes UI login roles before sending them to the backend", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 1, email: "user@example.com", role: "Donor" } }),
    });
    global.fetch = fetchMock;

    await login("user@example.com", "secret123", "ngo");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({
        body: JSON.stringify({ email: "user@example.com", password: "secret123", role: "Receiver" }),
      })
    );
  });
});
