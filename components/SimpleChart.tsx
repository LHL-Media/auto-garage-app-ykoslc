
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText, Path } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  title?: string;
}

export function LineChart({ data, height = 200, color = colors.primary, title }: LineChartProps) {
  const theme = useTheme();
  
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={[styles.noDataText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }
  
  const chartWidth = screenWidth - 80;
  const chartHeight = height - 60;
  const padding = 40;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((item.value - minValue) / valueRange) * (chartHeight - padding * 2);
    return { x, y, value: item.value, label: item.label };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          {title}
        </Text>
      )}
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
          return (
            <Line
              key={`grid-${index}`}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke={theme.dark ? '#333' : '#E0E0E0'}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}
        
        {/* Line path */}
        <Path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={color}
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((ratio, index) => {
          const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
          const value = minValue + ratio * valueRange;
          return (
            <SvgText
              key={`y-label-${index}`}
              x={padding - 10}
              y={y + 5}
              fontSize="12"
              fill={theme.dark ? '#AAA' : colors.textSecondary}
              textAnchor="end"
            >
              {value.toFixed(1)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  title?: string;
}

export function BarChart({ data, height = 200, title }: BarChartProps) {
  const theme = useTheme();
  
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={[styles.noDataText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }
  
  const chartWidth = screenWidth - 80;
  const chartHeight = height - 80;
  const padding = 40;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (chartWidth - padding * 2) / data.length - 10;
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          {title}
        </Text>
      )}
      <Svg width={chartWidth} height={chartHeight}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - padding * 2);
          const x = padding + index * (barWidth + 10);
          const y = chartHeight - padding - barHeight;
          
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || colors.primary}
                rx="4"
              />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - padding + 20}
                fontSize="10"
                fill={theme.dark ? '#AAA' : colors.textSecondary}
                textAnchor="middle"
              >
                {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  title?: string;
}

export function PieChart({ data, size = 200, title }: PieChartProps) {
  const theme = useTheme();
  
  if (data.length === 0) {
    return (
      <View style={[styles.container, { height: size + 40 }]}>
        <Text style={[styles.noDataText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
          No data available
        </Text>
      </View>
    );
  }
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  
  let currentAngle = -90;
  const slices = data.map(item => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    
    return {
      pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: ((item.value / total) * 100).toFixed(1),
    };
  });
  
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: theme.dark ? '#FFF' : colors.text }]}>
          {title}
        </Text>
      )}
      <View style={styles.pieContainer}>
        <Svg width={size} height={size}>
          {slices.map((slice, index) => (
            <Path
              key={`slice-${index}`}
              d={slice.pathData}
              fill={slice.color}
            />
          ))}
        </Svg>
        <View style={styles.legend}>
          {slices.map((slice, index) => (
            <View key={`legend-${index}`} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: slice.color }]} />
              <Text style={[styles.legendText, { color: theme.dark ? '#AAA' : colors.textSecondary }]}>
                {slice.label}: {slice.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 60,
  },
  pieContainer: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
  },
});
