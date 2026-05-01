export default function Footer() {
  return (
    <footer className="footer">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} Women Hub
        </p>
        <p className="small text-muted">
          Built for modern ecommerce experience
        </p>
      </div>
    </footer>
  );
}