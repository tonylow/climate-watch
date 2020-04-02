import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import Draggable from 'react-draggable';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Icon from 'components/icon';
import handleIcon from 'assets/icons/handle.svg';
import styles from './data-zoom.scss';

function DataZoom(props) {
  const { data, onYearChange } = props;
  const steps = data && data.length - 1;
  const dataZoomRef = useRef();
  const [width, setWidth] = useState(0);
  const PADDING = 20;
  const [position, setPosition] = useState({ min: 0, max: width - PADDING });

  useEffect(() => {
    if (dataZoomRef.current) {
      const debouncedSetWidth = debounce(
        () => setWidth(dataZoomRef.current.offsetWidth),
        500
      );

      const refWidth = dataZoomRef.current.offsetWidth;
      setWidth(refWidth);
      setPosition({
        ...position,
        max: refWidth - PADDING
      });

      window.addEventListener('resize', debouncedSetWidth);
      return () => {
        window.removeEventListener('resize', debouncedSetWidth);
      };
    }
    return undefined;
  }, [dataZoomRef]);

  const getYear = handleType => {
    const handleStep = (steps * position[handleType]) / (width - PADDING);
    const stepData = data && data[Math.floor(handleStep)];
    return stepData && stepData.x;
  };

  const handleStop = () => {
    onYearChange(getYear('min'), getYear('max'));
  };

  const handleDrag = (ui, handleType) =>
    setPosition({
      ...position,
      [handleType]: position[handleType] + ui.deltaX
    });

  const renderDraggable = handleType => {
    const GAP_BETWEEN_HANDLES = 15;
    const leftBound =
      handleType === 'min' ? 0 : position.min + GAP_BETWEEN_HANDLES;
    const rightBound =
      handleType === 'min'
        ? position.max - GAP_BETWEEN_HANDLES
        : width - PADDING;
    return (
      <Draggable
        axis="x"
        handle={`#handle${handleType}`}
        defaultPosition={{ x: position[handleType], y: 0 }}
        position={{ x: position[handleType], y: 0 }}
        onStop={handleStop}
        onDrag={throttle((_, ui) => handleDrag(ui, handleType), 50)}
        bounds={{ left: leftBound, right: rightBound }}
      >
        <div id={`handle${handleType}`} className={styles.handle}>
          <Icon icon={handleIcon} className={styles.handleIcon} />
        </div>
      </Draggable>
    );
  };

  if (!data) return null;
  const CENTER_HANDLE_PADDING = 7.5;
  return (
    <div className={styles.dataZoom} ref={dataZoomRef}>
      <div className={styles.selector}>
        <div
          className={styles.veil}
          style={{ width: position.min + CENTER_HANDLE_PADDING }}
        />
        <div
          className={styles.selectedPart}
          style={{
            width: position.max - position.min,
            left: position.min + CENTER_HANDLE_PADDING
          }}
        />
        <div
          className={cx(styles.veil, styles.right)}
          style={{
            width: width + CENTER_HANDLE_PADDING / 3 - PADDING - position.max
          }}
        />
        {renderDraggable('min')}
        {renderDraggable('max')}
      </div>
      <ResponsiveContainer height={35}>
        <AreaChart data={data}>
          <Area dataKey="total" stroke="#333" strokeWidth="2" fill="#868697" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

DataZoom.propTypes = {
  data: PropTypes.array,
  onYearChange: PropTypes.func.isRequired
};

export default DataZoom;
