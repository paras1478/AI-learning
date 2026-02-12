import React from "react";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold"></h1>
        <p className="text-slate-500">
        </p>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Total Documents" value="1" icon={<FileText />} />
        <Stat title="Total Flashcards" value="10" icon={<BookOpen />} />
        <Stat title="Total Quizzes" value="1" icon={<BrainCircuit />} />
      </div>

      
      <div className="bg-white rounded-xl border">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <Clock size={18} />
          <h2 className="font-semibold">Recent Activity</h2>
        </div>

        <div className="px-6 py-4 flex justify-between">
          <div>
            <p className="font-medium">
              Accessed Document: React JS Study Guide
            </p>
            <p className="text-sm text-slate-500">
              22/11/2025, 10:39:15
            </p>
          </div>
          <button className="text-emerald-600 font-semibold">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl border flex justify-between items-center">
    <div>
      <p className="text-xs uppercase text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default Dashboard;
