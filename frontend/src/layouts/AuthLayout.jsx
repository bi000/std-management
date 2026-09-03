function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

export default AuthLayout;
