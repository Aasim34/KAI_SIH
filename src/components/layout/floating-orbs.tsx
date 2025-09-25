export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="floating-orb w-32 h-32 top-10 left-10 opacity-50"></div>
      <div className="floating-orb w-24 h-24 top-1/3 right-20" style={{ animationDelay: '-2s' }}></div>
      <div className="floating-orb w-40 h-40 bottom-20 left-1/4" style={{ animationDelay: '-4s' }}></div>
      <div className="floating-orb w-20 h-20 bottom-10 right-1/2 opacity-50" style={{ animationDelay: '-6s' }}></div>
    </div>
  );
}
