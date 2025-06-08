import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/translations/useTranslation';

interface MovieFinancialChartProps {
  budget: number;
  revenue: number;
}

function MovieFinancialChart({ budget, revenue }: MovieFinancialChartProps) {
  const { t } = useTranslation();
  
  const formatToMillions = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const data = [
    {
      name: t('budget'),
      value: budget,
      fill: '#8884d8'
    },
    {
      name: t('revenue'),
      value: revenue,
      fill: '#82ca9d'
    }
  ];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" gutterBottom>
        {t('financials')}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatToMillions} />
          <Tooltip 
            formatter={(value: number) => formatToMillions(value)}
            labelStyle={{ color: 'black' }}
          />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MovieFinancialChart; 