import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    "Início",
    "Consultar",
    "Sobre Nós",
    "Contato",
    "FAQ"
  ];


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = (item: string) => {
    setIsOpen(false);

    if (item === "Início") {
      if (location.pathname === "/") {
        scrollToTop();
      } else {
        navigate("/");
      }
      return;
    }

    if (item === "Sobre Nós") {
      navigate("/sobre-nos");
      return;
    }


    // Para Consultar e FAQ - sempre navegam para a página inicial primeiro
    if (location.pathname !== "/") {
      navigate("/");
      // Aguarda a navegação completar antes de fazer o scroll
      setTimeout(() => {
        scrollToSection(item);
      }, 150);
    } else {
      scrollToSection(item);
    }
  };

  const scrollToSection = (item: string) => {
    let elementId = item.toLowerCase().replace(/\s+/g, '-');
    if (item === "Consultar") {
      elementId = "consultas";
    }

    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={handleLogoClick}>
          <img
            src="/uploads/logo nova.png"
            alt="ConfereVeicular - Consulta de débitos veiculares"
            className="h-10 sm:h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Navigation - Desktop */}
        <div className="hidden md:flex items-center">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              item === "Contato" ? (
                <a
                  key={item}
                  href={`https://wa.me/5511921021578?text=${encodeURIComponent("Olá! Gostaria de entrar em contato para mais informações sobre os serviços.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors text-sm font-medium"
                >
                  {item}
                </a>
              ) : (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-accent hover:text-accent/80 transition-colors text-sm font-medium"
                >
                  {item}
                </button>
              )
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <span className="sr-only">Menu</span>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col space-y-6 mt-8">
              {/* Logo in mobile menu */}
              <div className="flex justify-center">
                <img
                  src="/uploads/logo nova.png"
                  alt="ConfereVeicular"
                  className="h-10 w-auto"
                />
              </div>

              {/* Navigation items */}
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  item === "Contato" ? (
                    <a
                      key={item}
                      href={`https://wa.me/5511921021578?text=${encodeURIComponent("Olá! Gostaria de entrar em contato para mais informações sobre os serviços.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-left text-accent hover:text-accent/80 transition-colors text-lg font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </a>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handleNavClick(item)}
                      className="text-left text-accent hover:text-accent/80 transition-colors text-lg font-medium py-2"
                    >
                      {item}
                    </button>
                  )
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;