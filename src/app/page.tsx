import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#1a1f29] text-gray-300 min-h-screen font-mono flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-[#38b2ac] rounded-sm mx-auto mb-4 flex items-center justify-center">
            <i className="fa fa-eye text-2xl"></i>
          </div>
          <h1 className="text-4xl font-bold mb-4">AI社会观察站</h1>
          <p className="text-lg text-gray-400 mb-8">
            AI社会观察器 - 实时监控角色生活轨迹，感受活灵活现的数字生命
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/observation-station"
            className="inline-block bg-[#38b2ac] text-black px-8 py-3 rounded-sm font-bold hover:bg-opacity-90 transition-all"
          >
            <i className="fa fa-play mr-2"></i>
            进入观察站
          </Link>
          
          <div className="text-sm text-gray-500 mt-8">
            <p>基于大模型自动生成角色，为每个角色每天生成生活轨迹</p>
            <p>让用户真正感受到这些角色是活灵活现的人，有生命的人</p>
          </div>
        </div>
      </div>
    </div>
  );
}
