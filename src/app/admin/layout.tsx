"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Star, 
  MessageSquare, 
  Image as ImageIcon, 
  LogOut,
  Menu,
  FolderOpen,
  ExternalLink,
  X,
  Mail,
  User
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-4 text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin/dashboard"
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: FileText,
      current: pathname.startsWith("/admin/posts")
    },
    {
      name: "Portfolio",
      href: "/admin/portfolio",
      icon: FolderOpen,
      current: pathname.startsWith("/admin/portfolio")
    },
    {
      name: "Authors",
      href: "/admin/authors",
      icon: User,
      current: pathname.startsWith("/admin/authors")
    },
    {
      name: "Media",
      href: "/admin/media",
      icon: ImageIcon,
      current: pathname.startsWith("/admin/media")
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: Star,
      current: pathname.startsWith("/admin/reviews")
    },
    {
      name: "Submissions",
      href: "/admin/submissions",
      icon: MessageSquare,
      current: pathname.startsWith("/admin/submissions")
    },
    {
      name: "Newsletter",
      href: "/admin/newsletter",
      icon: Mail,
      current: pathname.startsWith("/admin/newsletter")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Admin Panel
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all duration-200 ${
                        item.current
                          ? "border-blue-500 text-blue-600 bg-blue-50/50"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                Welcome, {session?.user?.name || "Admin"}
              </span>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Mobile menu button */}
              <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`sm:hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 ${
                    item.current
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
} 