/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import spinner from './spinner.gif';

export default () => (
  <>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading'
    />
  </>
);
