export const apiService = {
  async getProducts() {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getHealth() {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error("Health check failed");
    return response.json();
  }
};
