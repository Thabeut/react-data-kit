import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { ICONS } from "../constants/icons";
import { useTranslation } from "react-i18next";
import logo from "../assets/react-data-kit-logo.png";
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
  const { t } = useTranslation();
  const homeGroup = navGroups.find((group) => group.id === "home");
  const contributingGroup = navGroups.find((group) => group.id === "contributing");
  const componentGroups = navGroups.filter(
    (group) => group.id !== "home" && group.id !== "contributing",
  );

  return (
    <div className="docs-shell">
      <div className="docs-header-row">
        <div className="docs-sidebar__brand">
          <Link to="/" aria-label={t("docsNavHome")} className="docs-sidebar__logo-link">
            <img src={logo} alt={t("homeLogoAlt")} className="docs-sidebar__logo" />
          </Link>
          <div className="docs-sidebar__brand-text">
            <p className="docs-sidebar__title">{title}</p>
            <p className="docs-sidebar__subtitle">{packageName}</p>
          </div>
        </div>
        <header className="docs-topbar">
          <div className="docs-topbar__links" aria-label="Package links">
            <a
              className="docs-topbar__link"
              href="https://github.com/Thabeut/react-data-kit.git"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon={ICONS.github} width={18} height={18} />
            </a>
            <a
              className="docs-topbar__link"
              href="https://www.npmjs.com/package/@thabeut/react-data-kit"
              aria-label="npm"
              target="_blank"
              rel="noreferrer"
            >
              <Icon icon={ICONS.npm} width={18} height={18} />
            </a>
          </div>
          {toolbar}
        </header>
      </div>

      <div className="docs-main-row">
        <aside className="docs-sidebar" aria-label="Documentation">
          {homeGroup?.children?.length ? (
            <nav className="docs-nav-home" aria-label={t("docsNavHome")}>
              <ul className="docs-nav__sublist">
                {homeGroup.children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      className={({ isActive }) =>
                        clsx(
                          "docs-nav__sublink",
                          "docs-nav__sublink--home",
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
            </nav>
          ) : null}
          <div className="docs-sidebar__section">{t("docsSidebarComponents")}</div>
          <nav className="docs-nav-tree" aria-label={t("docsSidebarComponents")}>
            {componentGroups.map((group) => (
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
          {contributingGroup?.children?.length ? (
            <nav className="docs-nav-bottom" aria-label={t("docsNavContributing")}>
              <ul className="docs-nav__sublist">
                {contributingGroup.children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      className={({ isActive }) =>
                        clsx("docs-nav__sublink", isActive && "docs-nav__sublink--active")
                      }
                      end
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
        <div className="docs-panel">
          <main className="docs-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
