import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#12122A] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">关于我们</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">关于</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">博客</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">帮助中心</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">法律</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">隐私政策</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">服务条款</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">语言</h3>
            <ul className="space-y-2">
              <li><button className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">English</button></li>
              <li><button className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">中文</button></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
} 