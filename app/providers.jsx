// app/providers.jsx
"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { TripProvider } from "@/context/TripContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { TripIDProvider } from "@/context/TripIDContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { QueryProvider } from "@/context/QueryContext";
import { MessageProvider } from "@/context/MessageContext";
import { UserProvider } from "@/context/UserContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AppProvider } from "@/context/AppContext";
import { ChatProvider } from "@/context/ChatContext";
import { CitiesCategoriesProvider } from "@/context/CitiesCategoriesContext";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react"; // ✅ إضافة SessionProvider
import SeasonalTheme from "@/components/layout/SeasonalTheme";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SeasonalTheme>
            <Suspense fallback={<div>Loading filters...</div>}>
            <CurrencyProvider>
              <QueryProvider>
                <DataProvider>
                  <AuthProvider>
                    <NotificationsProvider>
                      <UserProvider>
                        <SecurityProvider>
                          <TripProvider>
                            <CitiesCategoriesProvider>
                              <LanguageProvider>
                                <ReviewsProvider>
                                  <MessageProvider>
                                    <TripIDProvider>
                                      <ChatProvider>
                                        <PurchaseProvider>
                                          <AppProvider>
                                            <ToastContainer
                                              position="top-right"
                                              autoClose={3000}
                                              theme="colored"
                                            />
                                            {children}
                                          </AppProvider>
                                        </PurchaseProvider>
                                      </ChatProvider>
                                    </TripIDProvider>
                                  </MessageProvider>
                                </ReviewsProvider>
                              </LanguageProvider>
                            </CitiesCategoriesProvider>
                          </TripProvider>
                        </SecurityProvider>
                      </UserProvider>
                    </NotificationsProvider>
                  </AuthProvider>
                </DataProvider>
              </QueryProvider>
            </CurrencyProvider>
            </Suspense>
          </SeasonalTheme>
        </ThemeProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
