import { Typography, Box, Button } from '@mui/material';
import NextLink from '@/routing/NextLink';
import { useTranslation } from '@/translations/useTranslation';
import { useLanguage } from '@/context/LanguageContext';

function AppTitle() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'lv' : 'en');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <NextLink href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {t('appTitle')}
        </Typography>
      </NextLink>
      <Button
        onClick={toggleLanguage}
        sx={{
          minWidth: 'unset',
          px: 1,
          color: 'inherit',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}
      >
        {language.toUpperCase()}
      </Button>
    </Box>
  );
}

export default AppTitle;
