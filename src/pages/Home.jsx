import React from 'react';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Farm2Customer</h1>
      <p style={{ maxWidth: 700 }}>
        This is the home page. Later it will show nearby products, search and filters.
      </p>

      <div style={{ marginTop: 20 }}>
        <div className="card" style={{ padding: 16 }}>
          <h3>How this app works (short)</h3>
          <ol>
            <li>Farmers register and post products with price & quantity.</li>
            <li>Customers browse, add to cart, and place orders.</li>
            <li>Orders are stored and visible to both customer and farmer.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
