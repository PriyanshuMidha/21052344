
const API_BASE_URL = 'http://20.244.56.144/test';

export async function fetchProducts(company, category, minPrice, maxPrice, limit) {
  try {
   
    // const response = await fetch(`${API_BASE_URL}/companies/${company}/categories/${category}/products/top-n${limit}minPrice${minPrice}-maxPrice${maxPrice}`);
    const response = await fetch('http://28.244.56.144/test/companies/AMZ/categories/Laptop/products/top-10&minPrice-1&maxPrice-2000');

    if (!response.ok) {
      throw new Error('Failed to fetch top products');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
}
