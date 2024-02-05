/* eslint-disable max-len */
import debounce from 'lodash.debounce';
import {
  Link,
  NavLink, useLocation, useParams, useSearchParams,
} from 'react-router-dom';
import { useCallback, useContext, useState } from 'react';
import { getSearchWith } from '../helpers/searchHelper';
import { ProductsContext } from './ProductsContext';

export const Navbar: React.FC = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean; }) => {
    return isActive
      ? 'navbar-item active active::after'
      : 'navbar-item';
  };

  const { pathname, search } = useLocation();
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const bagPathname = () => {
    if (pathname === '/') {
      return 'CartPage';
    }

    if (pathname.includes('CartPage')) {
      return pathname;
    }

    return `${pathname}/CartPage`;
  };

  function setSearchWith(params: any) {
    const s = getSearchWith(searchParams, params);

    setSearchParams(s);
  }

  const {
    favIds, cartIds,
  } = useContext(ProductsContext);

  const totalCount = cartIds.map(arr => arr[1]).reduce((sum, cur) => sum + cur, 0);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const setAppliedQuery = (e: string) => setSearchWith({ query: e || null });
  const applyQuery = useCallback(debounce(setAppliedQuery, 700), [setAppliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar-item">
        <div className=" navbar__logo">
          <img className="navbar__logo--logo" src="icons/logo.svg" alt="logo" />
          <img className="navbar__logo--add" src="icons/addLogo.png" alt="addLogo" />
        </div>
      </NavLink>

      {pathname !== '/bag' && (
        <div className="navbar__links" data-cy="categoryLinksContainer">
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
        </div>
      )}

      <div className="navbar__right">
        <>
          <div className={pathname.slice(1) === category && pathname !== '/bag'
            ? 'navbar__search'
            : 'navbar__search navbar__search--hide'}
          >
            <input
              className="navbar__search-input"
              placeholder={`Search in ${pathname.slice(1)}...`}
              value={query}
              onChange={handleQueryChange}
            />

            {query
              ? (
                <svg
                  onClick={() => {
                    setSearchWith({ query: null });
                    setQuery('');
                  }}
                  className="navbar__search-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.4716 4.47138C12.7319 4.21103 12.7319 3.78892 12.4716 3.52858C12.2112 3.26823 11.7891 3.26823 11.5288 3.52858L8.00016 7.05717L4.47157 3.52858C4.21122 3.26823 3.78911 3.26823 3.52876 3.52858C3.26841 3.78892 3.26841 4.21103 3.52876 4.47138L7.05735 7.99998L3.52876 11.5286C3.26841 11.7889 3.26841 12.211 3.52876 12.4714C3.78911 12.7317 4.21122 12.7317 4.47157 12.4714L8.00016 8.94279L11.5288 12.4714C11.7891 12.7317 12.2112 12.7317 12.4716 12.4714C12.7319 12.211 12.7319 11.7889 12.4716 11.5286L8.94297 7.99998L12.4716 4.47138Z" fill="#313237" />
                </svg>
              )
              : <img className="navbar__search-svg" src="icons/search.svg" alt="search" />}
          </div>
        </>

        <NavLink to={{ pathname: 'favorites', search }} className={getLinkClass}>
          <div className="navbar__icons">
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
          className={getLinkClass}
        >
          <div className="navbar__icons">
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

        <Link to="menu" aria-label="menu" className="navbar-item">
          <div className="navbar__icons">
            <svg className="navbar__icons-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 4.5C1 4.08579 1.39175 3.75 1.875 3.75H14.125C14.6082 3.75 15 4.08579 15 4.5C15 4.91421 14.6082 5.25 14.125 5.25H1.875C1.39175 5.25 1 4.91421 1 4.5Z" fill="#313237" />
              <path d="M1 8C1 7.58579 1.39175 7.25 1.875 7.25H14.125C14.6082 7.25 15 7.58579 15 8C15 8.41421 14.6082 8.75 14.125 8.75H1.875C1.39175 8.75 1 8.41421 1 8Z" fill="#313237" />
              <path d="M1.875 10.75C1.39175 10.75 1 11.0858 1 11.5C1 11.9142 1.39175 12.25 1.875 12.25H14.125C14.6082 12.25 15 11.9142 15 11.5C15 11.0858 14.6082 10.75 14.125 10.75H1.875Z" fill="#313237" />
            </svg>
          </div>
        </Link>
      </div>
    </nav>
  );
};
