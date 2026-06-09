import { Fragment } from 'react';

export function NumberPlus({ value, plus = true, plusColor = '#d68307' }) {
  return (
    <Fragment>
      {value}
      {plus && (
        <span style={{ color: plusColor, fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 400 }}>
          +
        </span>
      )}
    </Fragment>
  );
}
