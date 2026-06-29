import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsGraphProps {
    history: { time: number; wpm: number; accuracy: number }[];
}

export function AnalyticsGraph({ history }: AnalyticsGraphProps) {
    if (!history || history.length === 0) return null;

    return (
        <div className="w-full h-72 mt-8 bg-zinc-900/60 rounded-2xl border border-zinc-700/40 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-widest text-zinc-400 mb-6 text-left font-bold">Performance over time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} opacity={0.5} />
                    <XAxis 
                        dataKey="time" 
                        stroke="#71717a" 
                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }} 
                        tickFormatter={(val) => `${val}s`}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis 
                        yAxisId="left" 
                        stroke="#fbbf24" 
                        tick={{ fill: '#fbbf24', fontSize: 12, fontWeight: 600 }} 
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#34d399" 
                        tick={{ fill: '#34d399', fontSize: 12, fontWeight: 600 }} 
                        domain={[0, 100]}
                        tickFormatter={(val) => `${val}%`}
                        axisLine={false}
                        tickLine={false}
                        dx={10}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                        labelStyle={{ color: '#a1a1aa', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        cursor={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="wpm" 
                        name="WPM" 
                        stroke="#fbbf24" 
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorWpm)"
                        activeDot={{ r: 6, fill: '#fbbf24', stroke: '#18181b', strokeWidth: 2 }} 
                    />
                    <Area 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="accuracy" 
                        name="Accuracy" 
                        stroke="#34d399" 
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAcc)"
                        activeDot={{ r: 5, fill: '#34d399', stroke: '#18181b', strokeWidth: 2 }} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
