import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const ShopmainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ShopmainLayout;