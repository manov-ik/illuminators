import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OxygenLevelGraph = ({ data }) => {
  return (
    <div>
      <h2 className='text-white text-center'>Oxygen Levels</h2>
      <ResponsiveContainer width="100%" height={300}>
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
    </div>
  );
};

export default OxygenLevelGraph;
