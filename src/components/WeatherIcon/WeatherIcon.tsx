import type { Condition } from '../../types/weather';
import './WeatherIcon.css';

interface WeatherIconProps {
  condition: Condition;
  size?: number;
  title?: string;
}

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const CLOUD_PATH = 'M16 40h20a8 8 0 0 0 1-15.9A10 10 0 0 0 18 22.5 8.8 8.8 0 0 0 16 40z';

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="weather-icon__sun">
      <circle cx={cx} cy={cy} r={r} />
      {RAY_ANGLES.map((angle) => (
        <line key={angle} x1={cx} y1={cy - r - 3} x2={cx} y2={cy - r - 6} transform={`rotate(${angle} ${cx} ${cy})`} />
      ))}
    </g>
  );
}

function Cloud({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
  return <path className="weather-icon__cloud" d={CLOUD_PATH} transform={`translate(${dx} ${dy})`} />;
}

export default function WeatherIcon({ condition, size = 32, title }: WeatherIconProps) {
  return (
    <svg
      className="weather-icon"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {condition === 'sunny' && <Sun cx={24} cy={24} r={9} />}
      {condition === 'partly-cloudy' && (<><Sun cx={19} cy={18} r={7} /><Cloud dx={3} dy={2} /></>)}
      {condition === 'cloudy' && <Cloud dy={-2} />}
      {condition === 'rain' && (
        <>
          <Cloud dy={-5} />
          <g className="weather-icon__rain">
            <line x1="18" y1="38" x2="16" y2="44" />
            <line x1="25" y1="38" x2="23" y2="44" />
            <line x1="32" y1="38" x2="30" y2="44" />
          </g>
        </>
      )}
      {condition === 'storm' && (
        <>
          <Cloud dy={-6} />
          <polygon className="weather-icon__bolt" points="26,30 20,40 25,40 22,47 31,36 26,36" />
        </>
      )}
    </svg>
  );
}
