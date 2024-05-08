// AllProductsPage.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Filters from './Filters';
import Pagination from './Pagination';
import { fetchProducts } from '../api';

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    
    fetchProducts('AMZ', 'Laptop', 1, 10000, 10).then((data) => {
      setProducts(data);
      setTotalPages(1); // Assuming API response provides total pages
    });
  }, []);

  const handleFilterChange = (minPrice, maxPrice) => {
    setFilters({ minPrice, maxPrice });
    setCurrentPage(1);
    // You can make another API call here with the updated filters
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // You can make another API call here to fetch products for the selected page
  };

  return (
    <div>
      <Filters onChange={handleFilterChange} />
      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AllProductsPage;
