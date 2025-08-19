import { Outlet } from "react-router-dom"
import { MainSidebar } from "./MainSidebar"
import { Header } from "./header"

export function DashboardLayout() {
  return (
    <section className="bg-background min-h-screen">
        <div className="grid grid-cols-12">
            <div className="col-span-3">
                <MainSidebar />
            </div>
            <div className="col-span-9">
                <div className="sticky top-0 w-full z-10">
                    <Header />
                </div>
                <main className="scrollable-custom p-6 mt-4 h-[calc(100%-81px)] w-full ">
                    <Outlet />
                </main>
            </div>
        </div>
    </section>
  )
}
