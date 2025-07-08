
import { NotFound as GhostNotFound } from "@/components/ui/ghost-404-page"
import './globals.css'
export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white">
      <GhostNotFound />
    </div>
  );

}