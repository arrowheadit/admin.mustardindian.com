import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticatedOnly, GuestsOnly } from "./middleware";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Home, Login ,Page,EditPageSection,Configs} from "@/pages";
import { useAuth } from "@/context/hooks";
import { useEffect, useState } from "react";


export default function ApplicationRoutes() {
    const { isAuthenticated } = useAuth();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[])

    return (
        mounted && (
            <BrowserRouter>
                <Routes>

                    {/* Guest Routes Group */}
                    <Route element={<GuestsOnly isAuthenticated={isAuthenticated} />}>
                        <Route path="/login" element={<Login />} />
                    </Route>

                    {/* Protected Routes Group */}
                    <Route element={<AuthenticatedOnly isAuthenticated={isAuthenticated} />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/" element={<Home />} />   
                            <Route path="/settings">
                                <Route path="pages" element={<Page />} /> 
                                <Route path="configs" element={<Configs />} /> 
                                <Route path="pages/edit-page-section/:slug" element={<EditPageSection />} />
                                
                                {/* <Route path="pages/edit-page-section/:slug" element={<EditPageSection />} />
                                <Route path="pages/seo-setup/:slug" element={<SeoSetup />} /> */}
                               
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>    
        )
    );
}
