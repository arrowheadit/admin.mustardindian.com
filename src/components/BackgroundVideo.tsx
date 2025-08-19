
export default function BackgroundVideo() {
  return (
    <video
      className="absolute left-0 top-0 w-full h-full pointer-events-none object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster="/breadcrumbs-bg.jpg"
    >
      <source src="/food.mp4" type="video/mp4" />
    </video>
  );
}
