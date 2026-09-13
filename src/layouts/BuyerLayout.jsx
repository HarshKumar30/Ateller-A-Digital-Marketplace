import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BuyerLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <main>
        <Outlet context={{ searchQuery }} />
      </main>
      <Footer />
    </>
  );
}
