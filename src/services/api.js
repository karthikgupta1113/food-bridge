export const heroApi = {
  stats: async () => {
    return {
      total_pickups: 0,
      meals_saved: 0,
      rating: 0,
      points: 0,
    };
  },
  opportunities: async () => {
    return [];
  },
  myPickups: async () => {
    return [];
  },
  accept: async (id) => {
    return { success: true };
  },
  updateStatus: async (id, status) => {
    return { success: true, status };
  },
};
