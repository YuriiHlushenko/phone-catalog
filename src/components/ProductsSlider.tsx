/* eslint-disable max-len */
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { ProductCard } from './ProductCard';
import { Filter } from '../types/filter';
import { ProductsContext } from './ProductsContext';
import { Loader } from './Loader';

type Props = {
  filter: Filter;
};

export const ProductsSlider: React.FC<Props> = ({ filter }) => {
  const {
    products, isLoading, errorMessage, cardWidth,
  } = useContext(ProductsContext);
  const [curPage, setCurPage] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const filteredProds = products.filter(p => {
    switch (filter) {
      case Filter.recomend:
      case Filter.discount:
        return p.discount;
      case Filter.new:
        return !p.discount;
      default:
        return true;
    }
  });

  if (filter === Filter.discount) {
    filteredProds.sort((a, b) => a.discount * a.price - b.discount * b.price);
  }

  const sliderLine = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  function init() {
    if (slider.current) {
      setSliderWidth(slider.current.offsetWidth);
    }

    if (sliderLine.current) {
      sliderLine.current.style.transform = 'translateX(0)';
    }

    setCurPage(0);
  }

  useEffect(() => {
    init();
  }, [slider.current]);

  window.addEventListener('resize', init);

  const title = () => {
    switch (filter) {
      case Filter.discount:
        return 'Hot Prices';
      case Filter.new:
        return 'Brand new models';
      case Filter.recomend:
        return 'You may also like';
      default:
        return true;
    }
  };

  if (errorMessage) {
    return (<h1>{errorMessage}</h1>);
  }

  if (isLoading) {
    return <Loader />;
  }

  const prevPage = () => {
    setCurPage(curPage - 1 >= 0
      ? curPage - 1 : 0);

    if (sliderLine.current) {
      if (curPage > 0) {
        sliderLine.current.style.transform = `translateX(${-(Math.floor(sliderWidth / cardWidth) * (cardWidth + 16) * (curPage - 1))}px)`;
      }
    }
  };

  const nextPage = () => {
    const numPages = Math.ceil(filteredProds.length / Math.floor(sliderWidth / cardWidth));

    setCurPage(curPage + 1 < numPages - 1
      ? curPage + 1 : numPages - 1);

    if (sliderLine.current) {
      sliderLine.current.style.transform = `translateX(${
        -(Math.floor(sliderWidth / cardWidth) * (cardWidth + 16) * (curPage + 1))
      }px)`;
    }
  };

  type Position = number | null;

  let xDown: Position = null;
  let yDown: Position = null;

  function getTouches(evt: TouchEvent) {
    return evt.touches;
  }

  function handleTouchStart(evt: TouchEvent) {
    const firstTouch = getTouches(evt)[0];

    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt: TouchEvent) {
    if (!xDown || !yDown) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        nextPage();
      } else {
        prevPage();
      }
    } else if (yDiff > 0) {
      return;
    }

    xDown = null;
    yDown = null;
  }

  if (slider.current) {
    slider.current.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.current.addEventListener('touchmove', handleTouchMove, { passive: true });
  }

  return (
    <div className="pageSection">
      <div className="pageSection__buttonsTitle">
        <h1 className="pageSection__title">{title()}</h1>
        <div className="pageSection__buttons">
          <button
            type="button"
            className="pageSection__button"
            onClick={prevPage}
            disabled={curPage === 0}
            aria-label="previous"
          >
            <svg className="pageSection__button-arrow" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.47136 0.528606C5.21101 0.268256 4.7889 0.268256 4.52855 0.528606L0.528555 4.52861C0.268205 4.78896 0.268205 5.21107 0.528555 5.47141L4.52855 9.47141C4.7889 9.73176 5.21101 9.73176 5.47136 9.47141C5.73171 9.21107 5.73171 8.78896 5.47136 8.52861L1.94277 5.00001L5.47136 1.47141C5.73171 1.21107 5.73171 0.788955 5.47136 0.528606Z" />
            </svg>
          </button>
          <button
            type="button"
            className="pageSection__button"
            onClick={nextPage}
            disabled={curPage === Math.ceil(filteredProds.length / Math.floor(sliderWidth / cardWidth)) - 1}
            aria-label="next"
          >
            <svg width="6" className="pageSection__button-arrow" height="10" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.528636 0.528606C0.788986 0.268256 1.2111 0.268256 1.47145 0.528606L5.47145 4.52861C5.73179 4.78896 5.73179 5.21107 5.47145 5.47141L1.47145 9.47141C1.2111 9.73176 0.788986 9.73176 0.528636 9.47141C0.268287 9.21107 0.268287 8.78896 0.528636 8.52861L4.05723 5.00001L0.528636 1.47141C0.268287 1.21107 0.268287 0.788955 0.528636 0.528606Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pageSection__container pageSection__container--slider" ref={slider}>
        <div className="pageSection__container--slider-line" ref={sliderLine}>
          {filteredProds.map(product => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>

    </div>
  );
};
