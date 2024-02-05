/* eslint-disable max-len */
import { useContext, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ProductsContext } from './ProductsContext';

export const Menu: React.FC = () => {
  const { pathname, search} = useLocation();
  const { favIds, cartIds } = useContext(ProductsContext);

  const menu = useRef<HTMLDivElement>(null);

  if (pathname.includes('menu')) {
    document.body.classList.add('page__body--with-menu');

    if (menu.current) {
      menu.current.style.transform = 'translateX(0)';
    }
  } else {
    document.body.classList.remove('page__body--with-menu');

    if (menu.current) {
      menu.current.style.transform = 'translateX(-100%)';
    }
  }

  const getClass = ({ isActive }: { isActive: boolean; }) => {
    return isActive
      ? 'navbar-item active active::after'
      : 'navbar-item';
  };

  const getLinkClass = ({ isActive }: { isActive: boolean; }) => {
    return isActive
      ? 'navbar-item navbar-item--menu active active::after'
      : 'navbar-item navbar-item--menu';
  };

  const bagPathname = () => {
    if (pathname === '/') {
      return 'CartPage';
    }

    if (pathname.includes('CartPage')) {
      return pathname;
    }

    return '/CartPage';
  };

  const totalCount = cartIds.map(arr => arr[1]).reduce((sum, cur) => sum + cur, 0);

  return (
    <nav className="menu menu--on" id="menu" ref={menu}>
      <nav className="navbar">
        <NavLink to="/home" className="navbar-item">
          <div className=" navbar__logo">
            <img className="navbar__logo--logo" src="icons/logo.svg" alt="logo" />
            <img className="navbar__logo--add" src="icons/addLogo.png" alt="addLogo" />
          </div>
        </NavLink>

        <div className="navbar__right">
          <a href="/" aria-label="menu" className="navbar-item">
            <div className="navbar__icons">
              <svg className="navbar__icons-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.4716 4.4714C12.7319 4.21105 12.7319 3.78894 12.4716 3.52859C12.2112 3.26824 11.7891 3.26824 11.5288 3.52859L8.00016 7.05719L4.47157 3.52859C4.21122 3.26824 3.78911 3.26824 3.52876 3.52859C3.26841 3.78894 3.26841 4.21105 3.52876 4.4714L7.05735 7.99999L3.52876 11.5286C3.26841 11.7889 3.26841 12.211 3.52876 12.4714C3.78911 12.7317 4.21122 12.7317 4.47157 12.4714L8.00016 8.9428L11.5288 12.4714C11.7891 12.7317 12.2112 12.7317 12.4716 12.4714C12.7319 12.211 12.7319 11.7889 12.4716 11.5286L8.94297 7.99999L12.4716 4.4714Z" fill="#313237" />
              </svg>
            </div>
          </a>
        </div>
      </nav>

      <ul className="menu__list">
        <li className="menu__item">
          <NavLink to={{ pathname: '/', search }} className={getLinkClass}>
            Home
          </NavLink>
          <NavLink to={{ pathname: 'phones', search }} className={getLinkClass}>
            Phones
          </NavLink>
          <NavLink to={{ pathname: 'tablets', search }} className={getLinkClass}>
            Tablets
          </NavLink>
          <NavLink to={{ pathname: 'accessories', search }} className={getLinkClass}>
            Accesories
          </NavLink>
        </li>
      </ul>

      <div className="menu__footer">
        <NavLink to={{ pathname: 'favorites', search, hash: '' }} className={getClass}>
          <div className="navbar__icons menu__footer--icons">
            <img className="navbar__icons-svg" src="icons/favorites.svg" alt="favorite" />
            {favIds.length !== 0 && (
              <div className="navbar__icons-counter">
                <span className="navbar__icons-counter--num">
                  {favIds.length}
                </span>
              </div>
            )}
          </div>
        </NavLink>

        <NavLink
          to={{ pathname: bagPathname(), search }}
          className={getClass}
        >
          <div className="navbar__icons menu__footer--icons">
            <img className="navbar__icons-svg" src="icons/bag.svg" alt="bag" />
            {cartIds.length !== 0 && (
              <div className="navbar__icons-counter">
                <span className="navbar__icons-counter--num">
                  {totalCount}
                </span>
              </div>
            )}
          </div>
        </NavLink>
      </div>
    </nav>
  );
};
