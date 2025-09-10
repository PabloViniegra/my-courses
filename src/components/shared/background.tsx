export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
