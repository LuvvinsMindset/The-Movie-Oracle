import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import BaseThemeProvider, { getInitialPaletteMode } from '@/theme/BaseThemeProvider';
import createEmotionCache from '@/theme/createEmotionCache';
import AppLayout from '@/layout/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/context/UserContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { PaletteMode } from '@mui/material';
import App, { AppContext } from 'next/app';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  initialPaletteMode: PaletteMode;
}

const queryClient = new QueryClient();

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, initialPaletteMode } = props;

  return (
    <CacheProvider value={emotionCache}>
      <BaseThemeProvider initialPaletteMode={initialPaletteMode}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <LanguageProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </LanguageProvider>
          </UserProvider>
        </QueryClientProvider>
      </BaseThemeProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return {
    ...appProps,
    initialPaletteMode: getInitialPaletteMode(appContext.ctx),
  };
};

export default MyApp;
