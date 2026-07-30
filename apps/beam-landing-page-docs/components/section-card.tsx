import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  href?: string;
  title: string;
};

export function SectionCard({ children, href, title }: SectionCardProps) {
  const content = (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );

  if (href) {
    return (
      <a className="sectionCard" href={href}>
        {content}
      </a>
    );
  }

  return <div className="sectionCard">{content}</div>;
}
