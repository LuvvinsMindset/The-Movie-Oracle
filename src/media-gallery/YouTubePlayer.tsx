import { styled } from '@mui/material';

const StyledIframe = styled('iframe')({
  display: 'block',
  aspectRatio: '16 / 9',
  width: '100%',
});

interface YouTubePlayerProps {
  youTubeId: string;
}

function YouTubePlayer({ youTubeId }: YouTubePlayerProps) {
  return (
    <StyledIframe
      key={youTubeId}
      title="YouTubePlayer"
      src={`https://www.youtube.com/embed/${youTubeId}`}
      frameBorder="0"
      allowFullScreen
    />
  );
}

export default YouTubePlayer;
