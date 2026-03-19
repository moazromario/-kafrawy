/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { DeliveryProvider } from "./context/DeliveryContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { ServicesProvider } from "./context/ServicesContext";
import { MedicalProvider } from "./context/MedicalContext";
import { JobsProvider } from "./context/JobsContext";
import { CommunityProvider } from "./context/CommunityContext";
import Layout from "./components/layout/Layout";

// Lazy loading pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const MarketplaceHomePage = lazy(() => import("./pages/marketplace/MarketplaceHomePage"));
const ProductListPage = lazy(() => import("./pages/marketplace/ProductListPage"));
const ProductDetailPage = lazy(() => import("./pages/marketplace/ProductDetailPage"));
const MarketplaceCartPage = lazy(() => import("./pages/marketplace/MarketplaceCartPage"));
const MarketplaceCheckoutPage = lazy(() => import("./pages/marketplace/MarketplaceCheckoutPage"));
const MarketplaceOrderTrackingPage = lazy(() => import("./pages/marketplace/MarketplaceOrderTrackingPage"));
const MarketplaceOrderHistoryPage = lazy(() => import("./pages/marketplace/MarketplaceOrderHistoryPage"));
const MarketplaceStoresPage = lazy(() => import("./pages/marketplace/MarketplaceStoresPage"));
const MarketplaceStoreDetailPage = lazy(() => import("./pages/marketplace/MarketplaceStoreDetailPage"));
const MarketplacePromotionsPage = lazy(() => import("./pages/marketplace/MarketplacePromotionsPage"));
const MarketplaceNotificationsPage = lazy(() => import("./pages/marketplace/MarketplaceNotificationsPage"));
const MarketplaceProfilePage = lazy(() => import("./pages/marketplace/MarketplaceProfilePage"));
const MarketplaceSearchPage = lazy(() => import("./pages/marketplace/MarketplaceSearchPage"));
const ProductComparisonPage = lazy(() => import("./pages/marketplace/ProductComparisonPage"));
const QuickBuyPage = lazy(() => import("./pages/marketplace/QuickBuyPage"));
const ProductReviewPage = lazy(() => import("./pages/marketplace/ProductReviewPage"));
const MarketplaceFutureOrdersPage = lazy(() => import("./pages/marketplace/MarketplaceFutureOrdersPage"));
const MarketplaceCategoriesPage = lazy(() => import("./pages/marketplace/MarketplaceCategoriesPage"));
const MarketplaceWishlistPage = lazy(() => import("./pages/marketplace/MarketplaceWishlistPage"));
const CommunityPage = lazy(() => import("./pages/community/CommunityPage"));
const EventsPage = lazy(() => import("./pages/community/EventsPage"));
const PostDetailPage = lazy(() => import("./pages/community/PostDetailPage"));
const FriendsPage = lazy(() => import("./pages/community/FriendsPage"));
const FriendRequestsPage = lazy(() => import("./pages/community/FriendRequestsPage"));
const SuggestedFriendsPage = lazy(() => import("./pages/community/SuggestedFriendsPage"));
const GroupsPage = lazy(() => import("./pages/community/GroupsPage"));
const GroupDetailsPage = lazy(() => import("./pages/community/GroupDetailsPage"));
const PagesPage = lazy(() => import("./pages/community/PagesPage"));
const PageDetailsPage = lazy(() => import("./pages/community/PageDetailsPage"));
const ExplorePage = lazy(() => import("./pages/community/ExplorePage"));
const MessagesPage = lazy(() => import("./pages/community/MessagesPage"));
const NotificationsPage = lazy(() => import("./pages/community/NotificationsPage"));
const DoctorsPage = lazy(() => import("./pages/doctors/DoctorsPage"));
const WorkersPage = lazy(() => import("./pages/workers/WorkersPage"));
const DeliveryHomePage = lazy(() => import("./pages/delivery/DeliveryHomePage"));
const StoreListPage = lazy(() => import("./pages/delivery/StoreListPage"));
const StoreDetailPage = lazy(() => import("./pages/delivery/StoreDetailPage"));
const CartPage = lazy(() => import("./pages/delivery/CartPage"));
const CheckoutPage = lazy(() => import("./pages/delivery/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/delivery/OrderSuccessPage"));
const OrderTrackingPage = lazy(() => import("./pages/delivery/OrderTrackingPage"));
const DriverDashboard = lazy(() => import("./pages/delivery/DriverDashboard"));
const OrderHistoryPage = lazy(() => import("./pages/delivery/OrderHistoryPage"));
const DeliverySearchPage = lazy(() => import("./pages/delivery/DeliverySearchPage"));
const DeliveryNotificationsPage = lazy(() => import("./pages/delivery/NotificationsPage"));
const PromotionsPage = lazy(() => import("./pages/delivery/PromotionsPage"));
const AddAddressPage = lazy(() => import("./pages/delivery/AddAddressPage"));
const PaymentMethodPage = lazy(() => import("./pages/delivery/PaymentMethodPage"));
const OrderRatingPage = lazy(() => import("./pages/delivery/OrderRatingPage"));
const DeliveryMapPage = lazy(() => import("./pages/delivery/DeliveryMapPage"));
const UpcomingRemindersPage = lazy(() => import("./pages/delivery/UpcomingRemindersPage"));
const WalletPage = lazy(() => import("./pages/wallet/WalletPage"));
const WalletTopupPage = lazy(() => import("./pages/wallet/WalletTopupPage"));
const WalletStatusPage = lazy(() => import("./pages/wallet/WalletStatusPage"));
const WalletAdminPage = lazy(() => import("./pages/wallet/WalletAdminPage"));
const ServicesHomePage = lazy(() => import("./pages/services/ServicesHomePage"));
const ProfessionalsListPage = lazy(() => import("./pages/services/ProfessionalsListPage"));
const ProfessionalProfilePage = lazy(() => import("./pages/services/ProfessionalProfilePage"));
const BookingServicePage = lazy(() => import("./pages/services/BookingServicePage"));
const ServicesCheckoutPage = lazy(() => import("./pages/services/ServicesCheckoutPage"));
const ServiceTrackingPage = lazy(() => import("./pages/services/ServiceTrackingPage"));
const ServiceHistoryPage = lazy(() => import("./pages/services/ServiceHistoryPage"));
const ServiceRatingPage = lazy(() => import("./pages/services/ServiceRatingPage"));
const ServicesNotificationsPage = lazy(() => import("./pages/services/ServicesNotificationsPage"));
const ServicesPromotionsPage = lazy(() => import("./pages/services/ServicesPromotionsPage"));
const ProfessionalDashboardPage = lazy(() => import("./pages/services/ProfessionalDashboardPage"));
const AddServiceAddressPage = lazy(() => import("./pages/services/AddServiceAddressPage"));
const SelectPaymentMethodPage = lazy(() => import("./pages/services/SelectPaymentMethodPage"));
const ServiceSummaryPage = lazy(() => import("./pages/services/ServiceSummaryPage"));
const ServiceSuccessPage = lazy(() => import("./pages/services/ServiceSuccessPage"));
const CurrentServiceDetailsPage = lazy(() => import("./pages/services/CurrentServiceDetailsPage"));
const ProfessionalPortfolioPage = lazy(() => import("./pages/services/ProfessionalPortfolioPage"));
const SearchFilterPage = lazy(() => import("./pages/services/SearchFilterPage"));
const ServicesMapPage = lazy(() => import("./pages/services/ServicesMapPage"));
const UpcomingServicesRemindersPage = lazy(() => import("./pages/services/UpcomingServicesRemindersPage"));

const MedicalHomePage = lazy(() => import("./pages/medical/MedicalHomePage"));
const DoctorSearchPage = lazy(() => import("./pages/medical/DoctorSearchPage"));
const DoctorProfilePage = lazy(() => import("./pages/medical/DoctorProfilePage"));
const DoctorBookingPage = lazy(() => import("./pages/medical/DoctorBookingPage"));
const MedicalCheckoutPage = lazy(() => import("./pages/medical/MedicalCheckoutPage"));
const AppointmentsPage = lazy(() => import("./pages/medical/AppointmentsPage"));
const MedicalSuccessPage = lazy(() => import("./pages/medical/MedicalSuccessPage"));
const MedicalCentersPage = lazy(() => import("./pages/medical/MedicalCentersPage"));
const MedicalRatingPage = lazy(() => import("./pages/medical/MedicalRatingPage"));
const MedicalNotificationsPage = lazy(() => import("./pages/medical/MedicalNotificationsPage"));
const MedicalChatsPage = lazy(() => import("./pages/medical/MedicalChatsPage"));
const MedicalConversationPage = lazy(() => import("./pages/medical/MedicalConversationPage"));
const MedicalServicesPage = lazy(() => import("./pages/medical/MedicalServicesPage"));
const MedicalOffersPage = lazy(() => import("./pages/medical/MedicalOffersPage"));
const MedicalSettingsPage = lazy(() => import("./pages/medical/MedicalSettingsPage"));
const MedicalWalletPage = lazy(() => import("./pages/medical/MedicalWalletPage"));
const MedicalMapPage = lazy(() => import("./pages/medical/MedicalMapPage"));
const MedicalEmergencyPage = lazy(() => import("./pages/medical/MedicalEmergencyPage"));
const MedicalRecordsPage = lazy(() => import("./pages/medical/MedicalRecordsPage"));
const MedicalAddRecordPage = lazy(() => import("./pages/medical/MedicalAddRecordPage"));

const JobsHomePage = lazy(() => import("./pages/jobs/JobsHomePage"));
const JobDetailsPage = lazy(() => import("./pages/jobs/JobDetailsPage"));
const ApplyJobPage = lazy(() => import("./pages/jobs/ApplyJobPage"));
const ApplicationsDashboardPage = lazy(() => import("./pages/jobs/ApplicationsDashboardPage"));
const CVBuilderPage = lazy(() => import("./pages/jobs/CVBuilderPage"));
const JobNotificationsPage = lazy(() => import("./pages/jobs/JobNotificationsPage"));
const AdvancedSearchPage = lazy(() => import("./pages/jobs/AdvancedSearchPage"));
const EmployerDashboardPage = lazy(() => import("./pages/jobs/EmployerDashboardPage"));
const CompanyDetailsPage = lazy(() => import("./pages/jobs/CompanyDetailsPage"));
const JobHistoryPage = lazy(() => import("./pages/jobs/JobHistoryPage"));
const TrainingOffersPage = lazy(() => import("./pages/jobs/TrainingOffersPage"));
const JobAlertsSettingsPage = lazy(() => import("./pages/jobs/JobAlertsSettingsPage"));
const PostJobPage = lazy(() => import("./pages/jobs/PostJobPage"));
const JobApplicationsPage = lazy(() => import("./pages/jobs/JobApplicationsPage"));

const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("./pages/profile/EditProfilePage"));
const SettingsPage = lazy(() => import("./pages/profile/SettingsPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const AdminDashboard = lazy(() => import("./modules/admin/AdminDashboard"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-center" richColors />
      <AuthProvider>
      <MarketplaceProvider>
        <DeliveryProvider>
          <ServicesProvider>
            <MedicalProvider>
              <JobsProvider>
                <CommunityProvider>
                <BrowserRouter>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Marketplace Routes */}
            <Route path="marketplace" element={<MarketplaceHomePage />} />
            <Route path="marketplace/products" element={<ProductListPage />} />
            <Route path="marketplace/product/:id" element={<ProductDetailPage />} />
            <Route path="marketplace/cart" element={<MarketplaceCartPage />} />
            <Route path="marketplace/checkout" element={<MarketplaceCheckoutPage />} />
            <Route path="marketplace/order-tracking/:id" element={<MarketplaceOrderTrackingPage />} />
            <Route path="marketplace/order-history" element={<MarketplaceOrderHistoryPage />} />
            <Route path="marketplace/stores" element={<MarketplaceStoresPage />} />
            <Route path="marketplace/store/:id" element={<MarketplaceStoreDetailPage />} />
            <Route path="marketplace/promotions" element={<MarketplacePromotionsPage />} />
            <Route path="marketplace/notifications" element={<MarketplaceNotificationsPage />} />
            <Route path="marketplace/profile" element={<MarketplaceProfilePage />} />
            <Route path="marketplace/search" element={<MarketplaceSearchPage />} />
            <Route path="marketplace/compare" element={<ProductComparisonPage />} />
            <Route path="marketplace/quick-buy/:id" element={<QuickBuyPage />} />
            <Route path="marketplace/rate/:id" element={<ProductReviewPage />} />
            <Route path="marketplace/future-orders" element={<MarketplaceFutureOrdersPage />} />
            <Route path="marketplace/categories" element={<MarketplaceCategoriesPage />} />
            <Route path="marketplace/wishlist" element={<MarketplaceWishlistPage />} />

            <Route path="community" element={<CommunityPage />} />
            <Route path="community/explore" element={<ExplorePage />} />
            <Route path="community/post/:id" element={<PostDetailPage />} />
            <Route path="community/events" element={<EventsPage />} />
            <Route path="community/friends" element={<FriendsPage />} />
            <Route path="community/friends/requests" element={<FriendRequestsPage />} />
            <Route path="community/friends/suggestions" element={<SuggestedFriendsPage />} />
            <Route path="community/groups" element={<GroupsPage />} />
            <Route path="community/group/:id" element={<GroupDetailsPage />} />
            <Route path="community/pages" element={<PagesPage />} />
            <Route path="community/page/:id" element={<PageDetailsPage />} />
            <Route path="community/messages" element={<MessagesPage />} />
            <Route path="community/notifications" element={<NotificationsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="workers" element={<WorkersPage />} />
            <Route path="delivery" element={<DeliveryHomePage />} />
            <Route path="delivery/stores" element={<StoreListPage />} />
            <Route path="delivery/store/:id" element={<StoreDetailPage />} />
            <Route path="delivery/cart" element={<CartPage />} />
            <Route path="delivery/checkout" element={<CheckoutPage />} />
            <Route path="delivery/success" element={<OrderSuccessPage />} />
            <Route path="delivery/tracking/:id" element={<OrderTrackingPage />} />
            <Route path="delivery/driver" element={<DriverDashboard />} />
            <Route path="delivery/history" element={<OrderHistoryPage />} />
            <Route path="delivery/search" element={<DeliverySearchPage />} />
            <Route path="delivery/notifications" element={<DeliveryNotificationsPage />} />
            <Route path="delivery/promotions" element={<PromotionsPage />} />
            <Route path="delivery/address" element={<AddAddressPage />} />
            <Route path="delivery/payment" element={<PaymentMethodPage />} />
            <Route path="delivery/rate/:id" element={<OrderRatingPage />} />
            <Route path="delivery/map/:id" element={<DeliveryMapPage />} />
            <Route path="delivery/reminders" element={<UpcomingRemindersPage />} />

            {/* Wallet Module Routes */}
            <Route path="wallet" element={<WalletPage />} />
            <Route path="wallet/topup" element={<WalletTopupPage />} />
            <Route path="wallet/status/:status" element={<WalletStatusPage />} />
            <Route path="wallet/admin" element={<WalletAdminPage />} />

            {/* Technicians Module Routes (الفنيين) */}
            <Route path="services" element={<ServicesHomePage />} />
            <Route path="services/list" element={<ProfessionalsListPage />} />
            <Route path="services/profile/:id" element={<ProfessionalProfilePage />} />
            <Route path="services/booking/:id" element={<BookingServicePage />} />
            <Route path="services/checkout" element={<ServicesCheckoutPage />} />
            <Route path="services/tracking/:id" element={<ServiceTrackingPage />} />
            <Route path="services/history" element={<ServiceHistoryPage />} />
            <Route path="services/rating/:id" element={<ServiceRatingPage />} />
            <Route path="services/notifications" element={<ServicesNotificationsPage />} />
            <Route path="services/promotions" element={<ServicesPromotionsPage />} />
            <Route path="services/dashboard" element={<ProfessionalDashboardPage />} />
            <Route path="services/add-address" element={<AddServiceAddressPage />} />
            <Route path="services/payment-method" element={<SelectPaymentMethodPage />} />
            <Route path="services/summary" element={<ServiceSummaryPage />} />
            <Route path="services/success" element={<ServiceSuccessPage />} />
            <Route path="services/details/:id" element={<CurrentServiceDetailsPage />} />
            <Route path="services/portfolio/:id" element={<ProfessionalPortfolioPage />} />
            <Route path="services/filter" element={<SearchFilterPage />} />
            <Route path="services/map" element={<ServicesMapPage />} />
            <Route path="services/reminders" element={<UpcomingServicesRemindersPage />} />

            {/* Medical Module Routes */}
            <Route path="medical" element={<MedicalHomePage />} />
            <Route path="medical/search" element={<DoctorSearchPage />} />
            <Route path="medical/profile/:id" element={<DoctorProfilePage />} />
            <Route path="medical/booking/:id" element={<DoctorBookingPage />} />
            <Route path="medical/checkout" element={<MedicalCheckoutPage />} />
            <Route path="medical/appointments" element={<AppointmentsPage />} />
            <Route path="medical/success" element={<MedicalSuccessPage />} />
            <Route path="medical/hospitals" element={<MedicalCentersPage />} />
            <Route path="medical/clinics" element={<MedicalCentersPage />} />
            <Route path="medical/rate/:id" element={<MedicalRatingPage />} />
            <Route path="medical/notifications" element={<MedicalNotificationsPage />} />
            <Route path="medical/chats" element={<MedicalChatsPage />} />
            <Route path="medical/chat/:id" element={<MedicalConversationPage />} />
            <Route path="medical/services" element={<MedicalServicesPage />} />
            <Route path="medical/offers" element={<MedicalOffersPage />} />
            <Route path="medical/settings" element={<MedicalSettingsPage />} />
            <Route path="medical/wallet" element={<MedicalWalletPage />} />
            <Route path="medical/map" element={<MedicalMapPage />} />
            <Route path="medical/emergency" element={<MedicalEmergencyPage />} />
            <Route path="medical/records" element={<MedicalRecordsPage />} />
            <Route path="medical/add-record" element={<MedicalAddRecordPage />} />

            {/* Jobs Module Routes */}
            <Route path="jobs" element={<JobsHomePage />} />
            <Route path="jobs/list" element={<AdvancedSearchPage />} />
            <Route path="jobs/details/:id" element={<JobDetailsPage />} />
            <Route path="jobs/apply/:id" element={<ApplyJobPage />} />
            <Route path="jobs/dashboard" element={<ApplicationsDashboardPage />} />
            <Route path="jobs/cv-builder" element={<CVBuilderPage />} />
            <Route path="jobs/notifications" element={<JobNotificationsPage />} />
            <Route path="jobs/search" element={<AdvancedSearchPage />} />
            <Route path="jobs/employer" element={<EmployerDashboardPage />} />
            <Route path="jobs/company/:id" element={<CompanyDetailsPage />} />
            <Route path="jobs/history" element={<JobHistoryPage />} />
            <Route path="jobs/training" element={<TrainingOffersPage />} />
            <Route path="jobs/alerts-settings" element={<JobAlertsSettingsPage />} />
            <Route path="jobs/post" element={<PostJobPage />} />
            <Route path="jobs/:jobId/applications" element={<JobApplicationsPage />} />

            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
      </CommunityProvider>
      </JobsProvider>
      </MedicalProvider>
      </ServicesProvider>
      </DeliveryProvider>
      </MarketplaceProvider>
      </AuthProvider>
    </AppProvider>
  );
}

