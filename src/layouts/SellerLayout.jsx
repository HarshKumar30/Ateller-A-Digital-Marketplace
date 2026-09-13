import { Outlet } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import SellerFooter from '../components/SellerFooter';

export default function SellerLayout() {
  return (
    <>
      <SellerNavbar />
      <main>
        <Outlet />
      </main>
      <SellerFooter />
    </>
  );
}
