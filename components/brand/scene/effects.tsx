import type { ReactNode } from "react";
export function PublicationRails({
  title,
  metadata,
  children,
}: {
  title: ReactNode;
  metadata?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="publication-loom" data-systems="03 13 18">
      <div className="primary-plane">{title}</div>
      {metadata && <div className="secondary-plane metadata">{metadata}</div>}
      {children}
    </div>
  );
}
export function RegistrationLock({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <div className="registration-lock" key={id} data-systems="17">
      {children}
    </div>
  );
}
