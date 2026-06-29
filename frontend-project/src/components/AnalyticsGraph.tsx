import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsGraphProps {
    history: { time: number; wpm: number; accuracy: number }[];
}

export function AnalyticsGraph({ history }: AnalyticsGraphProps) {
    if (!history || history.length === 0) return null;

    return (
        <div className="w-full h-64 mt-8 bg-zinc-800/40 rounded-xl border border-zinc-700/30 p-4">
            <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-4 text-left">Performance over time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        stroke="#71717a" 
                        tick={{ fill: '#71717a', fontSize: 12 }} 
                        tickFormatter={(val) => `${val}s`}
                    />
                    <YAxis 
                        yAxisId="left" 
                        stroke="#fbbf24" 
                        tick={{ fill: '#fbbf24', fontSize: 12 }} 
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#a1a1aa" 
                        tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                        domain={[0, 100]}
                        tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                    />
                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="wpm" 
                        name="WPM" 
                        stroke="#fbbf24" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#fbbf24' }} 
                    />
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="accuracy" 
                        name="Accuracy" 
                        stroke="#71717a" 
                        strokeWidth={2}
                        dot={false} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
