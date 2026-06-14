import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <header className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Cafe HQ
          </h1>
        </div>
        <div>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 ring-2 ring-indigo-500/50" } }} />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </Show>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

        <Show when="signed-out">
          <div className="z-10 max-w-2xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium tracking-wide">
              Centralized Management
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Manage your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                entire cafe ecosystem
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Access the headquarters dashboard to monitor branches, manage users, and view real-time analytics.
            </p>
            <div className="mt-4">
              <SignInButton mode="modal">
                <button className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 cursor-pointer">
                  Get Started
                </button>
              </SignInButton>
            </div>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="col-span-1 md:col-span-3 text-left mb-4">
              <h2 className="text-3xl font-bold">Welcome back!</h2>
              <p className="text-slate-400 mt-2">Here's an overview of your cafe operations today.</p>
            </div>
            
            {/* Mock Dashboard Cards */}
            {[
              { title: "Active Branches", value: "12", trend: "+2 this month", color: "indigo" },
              { title: "Total Revenue", value: "$45,231", trend: "+15% vs last week", color: "cyan" },
              { title: "Active Orders", value: "84", trend: "Normal volume", color: "teal" }
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
        </Show>
      </main>
    </div>
  );
}
