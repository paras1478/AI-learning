import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isResultPage = /\/quizzes\/[^/]+\/results\/?$/.test(
    location.pathname
  );

  return (
    <div className="h-screen overflow-hidden">
      {!isResultPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <div
        className={`flex flex-col h-full transition-all duration-300 ${
          !isResultPage && isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {!isResultPage && (
          <Header
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}

        <main
          className={`flex-1 overflow-y-auto ${
            isResultPage ? "p-0" : "p-6"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
