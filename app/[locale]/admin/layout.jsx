export default function AdminLayout({ children }) {
  // Admin uses the single provider tree from app/providers.jsx.
  // A second tree here duplicated state and API requests.
  return children;
}
