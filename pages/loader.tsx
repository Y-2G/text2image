import React from 'react';
import styles from '../styles/Home.module.css'

const Loader = props => {
  return (
      <div className={ `${ styles.loader } ${ styles[ props.visible ] }` }>
        <img src="icon_loader.gif" alt="loading" />
      </div>
  );
}

export default Loader;