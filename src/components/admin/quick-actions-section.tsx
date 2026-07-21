import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, Calendar } from "lucide-react"

export function QuickActionsSection() {
  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <h2 className="text-white font-teko text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="space-y-3">
        <Button asChild className="w-full bg-[#C80036] hover:bg-[#a00028] text-white shadow-lg shadow-[#C80036]/30 transition-all duration-200 hover:scale-105">
          <Link href="/admin/sermons/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Sermon
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/5 transition-all duration-200 hover:scale-105 bg-transparent"
        >
          <Link href="/admin/testimonies">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Review Testimonies
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/5 transition-all duration-200 hover:scale-105 bg-transparent"
        >
          <Link href="/admin/attendance">
            <Calendar className="w-4 h-4 mr-2" />
            Log Attendance
          </Link>
        </Button>
      </div>
    </div>
  )
}