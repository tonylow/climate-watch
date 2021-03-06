import React from 'react';
import PropTypes from 'prop-types';
import { themr } from 'react-css-themr';
import cx from 'classnames';

import styles from './icon-styles.scss';

const Icon = ({ icon, theme, className = '', onClick }) => {
  const classNames = cx(className, theme.icon);
  return (
    <svg className={classNames} viewBox={icon.viewBox} onClick={onClick}>
      <use xlinkHref={`#${icon.id}`} />
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.object,
  onClick: PropTypes.func
};

export default themr('Icon', styles)(Icon);
