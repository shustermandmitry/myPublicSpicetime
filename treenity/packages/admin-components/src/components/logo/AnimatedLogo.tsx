/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React, { type FC } from 'react';

interface LogoTreenityProps {
  size?: number;
}

const AnimatedLogo: FC<LogoTreenityProps> = ({ size = 24 }) => {
  return (
    <Root>
      <SVG
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="logo-mask">
            <rect width="26" height="26" fill="white" />
            <AnimatedPath1 d="M24.25 10.25C24.25 14.75 17 13.5 17 13.5V6.49999C20.5 6.49999 24.25 5.75 24.25 10.25Z" />
            <AnimatedPath2 d="M1.75 15.7031C1.75 11.2031 9 12.4531 9 12.4531L9 19.4531C5.5 19.4531 1.75 20.2031 1.75 15.7031Z" />
            <AnimatedPath3 d="M13.5 5V9H10C7 9 6.5 6 6.5 5C6.5 4 7 1.5 10 1.5C13 1.5 13.5 3.5 13.5 5Z" />
            <AnimatedPath4 d="M12.5 21L12.5 17L16 17C19 17 19.5 20 19.5 21C19.5 22 19 24.5 16 24.5C13 24.5 12.5 22.5 12.5 21Z" />
          </mask>
        </defs>
        <g mask="url(#logo-mask)">
          <PathLeft
            d="M9.56589 20.1909V11.625H8.19225H5.28295C2.91784 11.625 1 13.5428 1 15.9079C1 18.2731 2.91784 20.1909 5.28295 20.1909H9.56589ZM2.37364 15.9079C2.37364 14.3017 3.67667 12.9986 5.28295 12.9986H8.19225V18.8172H5.28295C3.67528 18.8172 2.37364 17.5142 2.37364 15.9079Z"
            fill="url(#paint0_linear_16077_26050)"
          />
          <PathRight
            d="M20.7156 5.80859H16.4326V14.3745H17.8063H20.7156C23.0806 14.3745 24.9985 12.4567 24.9985 10.0915C24.9985 7.72643 23.0806 5.80859 20.7156 5.80859ZM20.7156 13.0008H17.8063V7.18224H20.7156C22.3219 7.18224 23.6248 8.48526 23.6248 10.0915C23.6248 11.6978 22.3219 13.0008 20.7156 13.0008Z"
            fill="url(#paint1_linear_16077_26050)"
          />
          <PathBottom
            d="M20.1909 20.7166C20.1909 18.3515 18.2731 16.4336 15.9079 16.4336H11.625V17.8073V20.7166C11.625 23.0817 13.5428 24.9995 15.9079 24.9995C18.2731 24.9995 20.1909 23.0817 20.1909 20.7166ZM12.9986 20.7166V17.8073H15.9079C17.5142 17.8073 18.8172 19.1104 18.8172 20.7166C18.8172 22.3229 17.5142 23.6258 15.9079 23.6258C14.3017 23.6258 12.9986 22.3229 12.9986 20.7166Z"
            fill="url(#paint2_linear_16077_26050)"
          />
          <PathTop
            d="M10.0894 9.56589H14.3723V8.19225V5.28295C14.3723 2.91784 12.4545 1 10.0894 1C7.72429 1 5.80646 2.91784 5.80646 5.28295C5.80784 7.64806 7.72429 9.56589 10.0894 9.56589ZM10.0894 2.37364C11.6957 2.37364 12.9987 3.67667 12.9987 5.28295V8.19225H10.0894C8.48312 8.19225 7.1801 6.88923 7.1801 5.28295C7.18149 3.67667 8.48312 2.37364 10.0894 2.37364Z"
            fill="url(#paint3_linear_16077_26050)"
          />
        </g>
        <g>
          <PathBg
            d="M9.56589 20.1909V11.625H8.19225H5.28295C2.91784 11.625 1 13.5428 1 15.9079C1 18.2731 2.91784 20.1909 5.28295 20.1909H9.56589ZM2.37364 15.9079C2.37364 14.3017 3.67667 12.9986 5.28295 12.9986H8.19225V18.8172H5.28295C3.67528 18.8172 2.37364 17.5142 2.37364 15.9079Z"
            fill="currentColor"
          />
          <PathBg
            d="M20.7156 5.80859H16.4326V14.3745H17.8063H20.7156C23.0806 14.3745 24.9985 12.4567 24.9985 10.0915C24.9985 7.72643 23.0806 5.80859 20.7156 5.80859ZM20.7156 13.0008H17.8063V7.18224H20.7156C22.3219 7.18224 23.6248 8.48526 23.6248 10.0915C23.6248 11.6978 22.3219 13.0008 20.7156 13.0008Z"
            fill="currentColor"
          />
          <PathBg
            d="M20.1909 20.7166C20.1909 18.3515 18.2731 16.4336 15.9079 16.4336H11.625V17.8073V20.7166C11.625 23.0817 13.5428 24.9995 15.9079 24.9995C18.2731 24.9995 20.1909 23.0817 20.1909 20.7166ZM12.9986 20.7166V17.8073H15.9079C17.5142 17.8073 18.8172 19.1104 18.8172 20.7166C18.8172 22.3229 17.5142 23.6258 15.9079 23.6258C14.3017 23.6258 12.9986 22.3229 12.9986 20.7166Z"
            fill="currentColor"
          />
          <PathBg
            d="M10.0894 9.56589H14.3723V8.19225V5.28295C14.3723 2.91784 12.4545 1 10.0894 1C7.72429 1 5.80646 2.91784 5.80646 5.28295C5.80784 7.64806 7.72429 9.56589 10.0894 9.56589ZM10.0894 2.37364C11.6957 2.37364 12.9987 3.67667 12.9987 5.28295V8.19225H10.0894C8.48312 8.19225 7.1801 6.88923 7.1801 5.28295C7.18149 3.67667 8.48312 2.37364 10.0894 2.37364Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_16077_26050"
            x1="5.28295"
            y1="11.625"
            x2="5.28295"
            y2="20.1909"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0BAA4F" />
            <stop offset="1" stopColor="#22BB8C" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_16077_26050"
            x1="20.7156"
            y1="5.8086"
            x2="20.7156"
            y2="14.3745"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0BAA4F" />
            <stop offset="1" stopColor="#22BB8C" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_16077_26050"
            x1="15.9079"
            y1="16.4336"
            x2="15.9079"
            y2="24.9995"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0BAA4F" />
            <stop offset="1" stopColor="#22BB8C" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_16077_26050"
            x1="10.0894"
            y1="1.00001"
            x2="10.0894"
            y2="9.56589"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0BAA4F" />
            <stop offset="1" stopColor="#22BB8C" />
          </linearGradient>
        </defs>
      </SVG>
    </Root>
  );
};

const Root = styled.div`
  position: relative;
`;

const animateOpacity = keyframes`
  0% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const PathBase = styled.path`
  animation: ${animateOpacity} 1.6s ease-in-out infinite;
  opacity: 1;
`;

const PathRight = styled(PathBase)`
  animation-delay: 0s;
`;

const PathBottom = styled(PathBase)`
  animation-delay: 0.4s;
`;

const PathLeft = styled(PathBase)`
  animation-delay: 0.8s;
`;

const PathTop = styled(PathBase)`
  animation-delay: 1.2s;
`;

const SVG = styled.svg`
  display: block;
`;

const PathBg = styled.path`
  color: ${p => p.theme.colorPrimary};
  opacity: 0.1;
  filter: saturate(0%);
`;

const animatePathKeyframes = keyframes`
  0% {
    stroke-dashoffset: 200;
  }
  99% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const AnimatedPathBase = styled.path`
  fill: none;
  stroke: black;
  stroke-width: 2;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: ${animatePathKeyframes} 1.6s ease-in-out infinite;
`;

const AnimatedPath1 = styled(AnimatedPathBase)`
  animation-delay: 0s;
`;

const AnimatedPath4 = styled(AnimatedPathBase)`
  animation-delay: 0.4s;
`;

const AnimatedPath2 = styled(AnimatedPathBase)`
  animation-delay: 0.8s;
`;

const AnimatedPath3 = styled(AnimatedPathBase)`
  animation-delay: 1.2s;
`;

export default AnimatedLogo;
