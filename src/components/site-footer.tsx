import Link from "next/link";

const links = [
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="summit-footer">
      <div className="summit-footer-inner">
        <p>© {new Date().getFullYear()} Industrial Summit</p>
        <nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-3">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
