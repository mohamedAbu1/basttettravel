// components/OAuthButtons.jsx
export default function OAuthButtons() {
  return (
    <div className="flex gap-2">
      <a
        href="/api/auth/oauth/google/start"
        className="btn btn-google"
      >
        الدخول عبر Google
      </a>
      <a
        href="/api/auth/oauth/facebook/start"
        className="btn btn-facebook"
      >
        الدخول عبر Facebook
      </a>
    </div>
  );
}
