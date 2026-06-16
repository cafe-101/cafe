export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50">
      <header className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 z-50 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold">
            K
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kitchen Receiver
          </h1>
        </div>
        <div>
          <button className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 transition-all font-bold">
            Online (Supabase WebSocket Active)
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full mb-4">
            <h2 className="text-3xl font-bold">Live Orders</h2>
          </div>
          
          {/* Mock Order Cards */}
          {[
            { id: "#1024", status: "PENDING", items: "2x Espresso, 1x Bagel", time: "2 min ago" },
            { id: "#1025", status: "PREPARING", items: "1x Latte, 1x Croissant", time: "5 min ago" },
          ].map((order, i) => (
            <div key={i} className={`border rounded-xl p-6 flex flex-col gap-4 ${order.status === 'PENDING' ? 'border-orange-500/50 bg-orange-500/10' : 'border-blue-500/50 bg-blue-500/10'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{order.id}</h3>
                <span className="text-sm font-medium opacity-75">{order.time}</span>
              </div>
              <p className="text-lg">{order.items}</p>
              <button className={`py-3 rounded-lg font-bold w-full ${order.status === 'PENDING' ? 'bg-orange-500 hover:bg-orange-400' : 'bg-blue-500 hover:bg-blue-400'}`}>
                {order.status === 'PENDING' ? 'START PREPARING' : 'MARK READY'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
