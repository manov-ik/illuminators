import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '30 mins ago', oxygen: 80 },
  { name: '25 mins ago', oxygen: 85 },
  { name: '20 mins ago', oxygen: 90 },
  { name: '15 mins ago', oxygen: 92 },
  { name: '10 mins ago', oxygen: 94 },
  { name: '5 mins ago', oxygen: 95 },
  { name: 'Now', oxygen: 96 },
];

const OxygenLevelGraph = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <h2 className='text-white'>Oxygen Levels</h2>
      <LineChart data={data}>
        <XAxis dataKey="name" tick={{ fill: 'white' }} />
        <YAxis domain={[70, 100]} tick={{ fill: 'white' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: 'none' }}
          itemStyle={{ color: '#605bbb' }}
        />
        <Line type="monotone" dataKey="oxygen" stroke="#8884d8" strokeWidth={2} dot={{ r: 6, fill: '#8884d8' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OxygenLevelGraph;
