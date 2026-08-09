/**
 * AuroraBackground — animated gradient blobs behind the entire app.
 * Uses CSS custom properties for theme-aware colors.
 * Renders as a fixed, non-interactive layer behind all content.
 */
const AuroraBackground = () => {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
    </div>
  );
};

export default AuroraBackground;
