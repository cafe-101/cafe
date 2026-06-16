export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <header className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
            F
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Franchise Platform
          </h1>
        </div>
        <div>
          <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
            Sign In / Sign Out (Supabase)
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="col-span-1 md:col-span-3 text-left mb-4">
            <h2 className="text-3xl font-bold">Franchise Dashboard Overview</h2>
            <p className="text-slate-400 mt-2">Here's an overview of your multi-store operations today.</p>
          </div>
          
          {/* Mock Dashboard Cards */}
          {[
            { title: "Active Stores", value: "32", trend: "+4 this month", color: "indigo" },
            { title: "Total Revenue", value: "$124,231", trend: "+12% vs last week", color: "cyan" },
            { title: "Active Orders", value: "214", trend: "High volume", color: "teal" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors cursor-pointer group">
              <h3 className="text-slate-400 font-medium mb-4">{stat.title}</h3>
              <p className="text-4xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
              <p className={`text-sm ${
                stat.color === 'indigo' ? 'text-indigo-400' :
                stat.color === 'cyan' ? 'text-cyan-400' :
                stat.color === 'teal' ? 'text-teal-400' : ''
              }`}>{stat.trend}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
