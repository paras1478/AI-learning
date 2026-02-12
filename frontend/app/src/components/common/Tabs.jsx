import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <nav className="relative border-b border-slate-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pb-3 text-sm font-semibold transition-colors
                ${
                  activeTab === tab.name
                    ? "text-emerald-600"
                    : "text-slate-600 hover:text-slate-900"
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>

              {activeTab === tab.name && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-6">
        {tabs.map((tab) =>
          tab.name === activeTab ? (
            <div key={tab.name}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
