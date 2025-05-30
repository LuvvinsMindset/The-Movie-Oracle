import Link, { LinkProps } from 'next/link';
import { SxProps, Theme, Link as MuiLink } from '@mui/material';
import { forwardRef } from 'react';

export type NextLinkProps = React.PropsWithChildren<LinkProps> & {
  className?: string;
  sx?: SxProps<Theme>;
};

const NextLink = forwardRef<React.ElementRef<typeof Link>, NextLinkProps>(
  function NextLink({ href, ...rest }, ref) {
    return (
      <MuiLink
        ref={ref}
        component={Link}
        href={href as any}
        underline="none"
        prefetch={false}
        {...rest}
      />
    );
  },
);

export default NextLink;
