import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", page: "landing" },
    { href: "/skills", label: "Skills", page: "skills" },
    { href: "/dashboard", label: "Dashboard", page: "dashboard" }
  ];

  const isActive = (page: string) => {
    if (page === "landing" && location === "/") return true;
    if (page === "skills" && location === "/skills") return true;
    if (page === "dashboard" && location.startsWith("/dashboard")) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" data-testid="link-home">
                <h1 className="text-2xl font-bold text-skill-blue dark:text-skill-blue">SkillSwap</h1>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-${item.page}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.page)
                      ? "text-skill-blue dark:text-skill-blue"
                      : "text-gray-600 dark:text-gray-300 hover:text-skill-blue dark:hover:text-skill-blue"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <ThemeToggle />
              <Link href="/auth" data-testid="link-auth">
                <Button className="bg-skill-blue text-white hover:bg-blue-600">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
              className="text-gray-600 hover:text-skill-blue"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-mobile-${item.page}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.page)
                      ? "text-skill-blue bg-blue-50"
                      : "text-gray-600 hover:text-skill-blue hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/auth" data-testid="link-mobile-auth">
                <Button 
                  className="w-full bg-skill-blue text-white hover:bg-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
