import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import "./docs-layout.css";

export type DocsNavChild = {
  to: string;
  label: string;
};

export type DocsNavGroup = {
  id: string;
  label: string;
  children: DocsNavChild[];
};

type DocsLayoutProps = {
  title: string;
  packageName: string;
  navGroups: DocsNavGroup[];
  toolbar: ReactNode;
  children: ReactNode;
};

export function DocsLayout({
  title,
  packageName,
  navGroups,
  toolbar,
  children,
}: DocsLayoutProps) {
  return (
    <div className="docs-shell">
      <div className="docs-header-row">
        <div className="docs-sidebar__brand">
          <p className="docs-sidebar__title">{title}</p>
          <p className="docs-sidebar__subtitle">{packageName}</p>
        </div>
        <header className="docs-topbar">
          <div className="docs-topbar__links" aria-label="Package links">
            <a className="docs-topbar__link" href="#" aria-label="GitHub">
              <Icon icon="mdi:github" width={18} height={18} />
            </a>
            <a className="docs-topbar__link" href="#" aria-label="npm">
              <Icon icon="mdi:npm" width={18} height={18} />
            </a>
          </div>
          {toolbar}
        </header>
      </div>

      <div className="docs-main-row">
        <aside className="docs-sidebar" aria-label="Documentation">
          <div className="docs-sidebar__section">Components</div>
          <nav className="docs-nav-tree" aria-label="Components">
            {navGroups.map((group) => (
              <div key={group.id} className="docs-nav__group">
                <div className="docs-nav__group-label">{group.label}</div>
                <ul className="docs-nav__sublist">
                  {group.children.map((child) => (
                    <li key={child.to}>
                      <NavLink
                        to={child.to}
                        className={({ isActive }) =>
                          clsx(
                            "docs-nav__sublink",
                            isActive && "docs-nav__sublink--active",
                          )
                        }
                        end
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="docs-panel">
          <main className="docs-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
