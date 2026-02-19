import { Home, ArrowDownToLine, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: ArrowDownToLine, label: "Saque", path: "/saque" },
    { icon: User, label: "Perfil", path: "/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2.5 px-4">
        {items.map((item) => {
          const isActive = location.pathname === item.path && item.label !== "Perfil";
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`relative ${isActive ? "" : ""}`}>
                <item.icon className={`h-5 w-5 transition-all ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
