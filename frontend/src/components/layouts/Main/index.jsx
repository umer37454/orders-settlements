import { Outlet } from "react-router-dom";
import Header from "./Header";

const Main = () => {
    return (
        <div className="d-flex flex-column flex-grow-1">
            <Header />

            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Main;