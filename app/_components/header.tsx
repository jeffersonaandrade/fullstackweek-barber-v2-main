import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-4 lg:p-6">
        <Link href="/">
          <Image 
            alt="FSW Barber" 
            src="/logo.png" 
            height={18} 
            width={120} 
            style={{ width: 'auto', height: 'auto' }}
            className="h-[18px] lg:h-[22px] w-auto"
          />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="h-9 w-9 lg:h-10 lg:w-10">
              <MenuIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
