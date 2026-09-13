import { useLocation } from 'react-router-dom';

const SELLER_PREFIXES = ['/seller/dashboard', '/seller/login', '/seller/register'];

export function getRoleForPath(pathname = '/') {
  return SELLER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ? 'seller'
    : 'buyer';
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActiveRole() {
  const { pathname } = useLocation();
  return getRoleForPath(pathname);
}
