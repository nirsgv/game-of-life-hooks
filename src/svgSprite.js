import React from 'react';
import sprite from './sprite.svg';

function SvgSprite ({...restProps}) {
    const {name, src = sprite, clickHandler, viewBox = '0 0 24 24', style={}} = restProps;
    const handleClick = (event) => {
        event.stopPropagation();
        clickHandler && clickHandler(event);
    };

    return (
        <span className='svg sprite'
            onClick={handleClick}
              style={style}
            >
           <svg viewBox={viewBox}>
                <use xlinkHref={`${src}#${name}`} />
            </svg>
        </span>
    );
}

export default SvgSprite;