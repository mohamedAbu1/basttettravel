import { TripIDProvider } from "./context/TripIDContext";
import { TripProvider } from "./context/TripContext";
import { MessageProvider } from "./context/MessageContext";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import { PurchaseProvider } from "./context/PurchaseContext";
import { CitiesCategoriesProvider } from "./context/CitiesCategoriesContext";

export default function AdminLayout({ children }) {
  return (
    <TripProvider>
      <TripIDProvider>
        <UserProvider>
          <AuthProvider>
            <MessageProvider>
              <PurchaseProvider>
                <CitiesCategoriesProvider>{children}</CitiesCategoriesProvider>
              </PurchaseProvider>
            </MessageProvider>
          </AuthProvider>
        </UserProvider>
      </TripIDProvider>
    </TripProvider>
  );
}
