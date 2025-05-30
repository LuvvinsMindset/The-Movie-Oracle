import ExternalLink from '@/routing/ExternalLink';
import { SvgIcon, Box, Typography } from '@mui/material';
import { useId } from 'react';

function TmdbAttribution() {
  const linearGradientId = useId();

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <ExternalLink href="https://www.themoviedb.org/">
        <SvgIcon viewBox="0 0 185.04 133.4" sx={{ fontSize: 48 }}>
          <defs>
            <linearGradient
              id={linearGradientId}
              y1="66.7"
              x2="185.04"
              y2="66.7"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#90cea1" />
              <stop offset="0.56" stopColor="#3cbec9" />
              <stop offset="1" stopColor="#00b3e5" />
            </linearGradient>
          </defs>
        </SvgIcon>
      </ExternalLink>
    </Box>
  );
}

export default TmdbAttribution;
