import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <di className="flex min-h-screen flex-col font-brand bg-tafach-light">
            <Header/>

            <main className="flex-1 max-w-7xl w-full mx-auto px-grid-2 py-grid-3">
                <Outlet/>
            </main>
   
            <Footer/>
        </di>
    );
}