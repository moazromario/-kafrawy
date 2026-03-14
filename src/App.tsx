/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import HomePage from "./pages/home/HomePage";
import MarketplaceHomePage from "./pages/marketplace/MarketplaceHomePage";
import ProductListPage from "./pages/marketplace/ProductListPage";
import ProductDetailPage from "./pages/marketplace/ProductDetailPage";
import MarketplaceCartPage from "./pages/marketplace/MarketplaceCartPage";
import MarketplaceCheckoutPage from "./pages/marketplace/MarketplaceCheckoutPage";
import MarketplaceOrderTrackingPage from "./pages/marketplace/MarketplaceOrderTrackingPage";
import MarketplaceOrderHistoryPage from "./pages/marketplace/MarketplaceOrderHistoryPage";
import MarketplaceStoresPage from "./pages/marketplace/MarketplaceStoresPage";
import MarketplaceStoreDetailPage from "./pages/marketplace/MarketplaceStoreDetailPage";
import MarketplacePromotionsPage from "./pages/marketplace/MarketplacePromotionsPage";
import MarketplaceNotificationsPage from "./pages/marketplace/MarketplaceNotificationsPage";
import MarketplaceProfilePage from "./pages/marketplace/MarketplaceProfilePage";
import MarketplaceSearchPage from "./pages/marketplace/MarketplaceSearchPage";
import ProductComparisonPage from "./pages/marketplace/ProductComparisonPage";
import QuickBuyPage from "./pages/marketplace/QuickBuyPage";
import ProductReviewPage from "./pages/marketplace/ProductReviewPage";
import MarketplaceFutureOrdersPage from "./pages/marketplace/MarketplaceFutureOrdersPage";
import MarketplaceCategoriesPage from "./pages/marketplace/MarketplaceCategoriesPage";
import MarketplaceWishlistPage from "./pages/marketplace/MarketplaceWishlistPage";
import CommunityPage from "./pages/community/CommunityPage";
import CommunityMap from "./pages/community/CommunityMap";
import EventsPage from "./pages/community/EventsPage";
import PostDetailPage from "./pages/community/PostDetailPage";
import FriendsPage from "./pages/community/FriendsPage";
import FriendRequestsPage from "./pages/community/FriendRequestsPage";
import SuggestedFriendsPage from "./pages/community/SuggestedFriendsPage";
import GroupsPage from "./pages/community/GroupsPage";
import MessagesPage from "./pages/community/MessagesPage";
import NotificationsPage from "./pages/community/NotificationsPage";
import DoctorsPage from "./pages/doctors/DoctorsPage";
import WorkersPage from "./pages/workers/WorkersPage";
import DeliveryHomePage from "./pages/delivery/DeliveryHomePage";
import StoreListPage from "./pages/delivery/StoreListPage";
import StoreDetailPage from "./pages/delivery/StoreDetailPage";
import CartPage from "./pages/delivery/CartPage";
import CheckoutPage from "./pages/delivery/CheckoutPage";
import OrderSuccessPage from "./pages/delivery/OrderSuccessPage";
import OrderTrackingPage from "./pages/delivery/OrderTrackingPage";
import DriverDashboard from "./pages/delivery/DriverDashboard";
import OrderHistoryPage from "./pages/delivery/OrderHistoryPage";
import DeliverySearchPage from "./pages/delivery/DeliverySearchPage";
import DeliveryNotificationsPage from "./pages/delivery/NotificationsPage";
import PromotionsPage from "./pages/delivery/PromotionsPage";
import AddAddressPage from "./pages/delivery/AddAddressPage";
import PaymentMethodPage from "./pages/delivery/PaymentMethodPage";
import OrderRatingPage from "./pages/delivery/OrderRatingPage";
import DeliveryMapPage from "./pages/delivery/DeliveryMapPage";
import UpcomingRemindersPage from "./pages/delivery/UpcomingRemindersPage";
import WalletPage from "./pages/wallet/WalletPage";
import WalletTopupPage from "./pages/wallet/WalletTopupPage";
import WalletStatusPage from "./pages/wallet/WalletStatusPage";
import WalletAdminPage from "./pages/wallet/WalletAdminPage";
import ServicesHomePage from "./pages/services/ServicesHomePage";
import ProfessionalsListPage from "./pages/services/ProfessionalsListPage";
import ProfessionalProfilePage from "./pages/services/ProfessionalProfilePage";
import BookingServicePage from "./pages/services/BookingServicePage";
import ServicesCheckoutPage from "./pages/services/ServicesCheckoutPage";
import ServiceTrackingPage from "./pages/services/ServiceTrackingPage";
import ServiceHistoryPage from "./pages/services/ServiceHistoryPage";
import ServiceRatingPage from "./pages/services/ServiceRatingPage";
import ServicesNotificationsPage from "./pages/services/ServicesNotificationsPage";
import ServicesPromotionsPage from "./pages/services/ServicesPromotionsPage";
import ProfessionalDashboardPage from "./pages/services/ProfessionalDashboardPage";
import AddServiceAddressPage from "./pages/services/AddServiceAddressPage";
import SelectPaymentMethodPage from "./pages/services/SelectPaymentMethodPage";
import ServiceSummaryPage from "./pages/services/ServiceSummaryPage";
import ServiceSuccessPage from "./pages/services/ServiceSuccessPage";
import CurrentServiceDetailsPage from "./pages/services/CurrentServiceDetailsPage";
import ProfessionalPortfolioPage from "./pages/services/ProfessionalPortfolioPage";
import SearchFilterPage from "./pages/services/SearchFilterPage";
import ServicesMapPage from "./pages/services/ServicesMapPage";
import UpcomingServicesRemindersPage from "./pages/services/UpcomingServicesRemindersPage";

import MedicalHomePage from "./pages/medical/MedicalHomePage";
import DoctorSearchPage from "./pages/medical/DoctorSearchPage";
import DoctorProfilePage from "./pages/medical/DoctorProfilePage";
import DoctorBookingPage from "./pages/medical/DoctorBookingPage";
import MedicalCheckoutPage from "./pages/medical/MedicalCheckoutPage";
import AppointmentsPage from "./pages/medical/AppointmentsPage";
import MedicalSuccessPage from "./pages/medical/MedicalSuccessPage";
import MedicalCentersPage from "./pages/medical/MedicalCentersPage";
import MedicalRatingPage from "./pages/medical/MedicalRatingPage";
import MedicalNotificationsPage from "./pages/medical/MedicalNotificationsPage";
import MedicalChatsPage from "./pages/medical/MedicalChatsPage";
import MedicalConversationPage from "./pages/medical/MedicalConversationPage";
import MedicalServicesPage from "./pages/medical/MedicalServicesPage";
import MedicalOffersPage from "./pages/medical/MedicalOffersPage";
import MedicalSettingsPage from "./pages/medical/MedicalSettingsPage";
import MedicalWalletPage from "./pages/medical/MedicalWalletPage";
import MedicalMapPage from "./pages/medical/MedicalMapPage";
import MedicalEmergencyPage from "./pages/medical/MedicalEmergencyPage";
import MedicalRecordsPage from "./pages/medical/MedicalRecordsPage";
import MedicalAddRecordPage from "./pages/medical/MedicalAddRecordPage";

import JobsHomePage from "./pages/jobs/JobsHomePage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import ApplyJobPage from "./pages/jobs/ApplyJobPage";
import ApplicationsDashboardPage from "./pages/jobs/ApplicationsDashboardPage";
import CVBuilderPage from "./pages/jobs/CVBuilderPage";
import JobNotificationsPage from "./pages/jobs/JobNotificationsPage";
import AdvancedSearchPage from "./pages/jobs/AdvancedSearchPage";
import EmployerDashboardPage from "./pages/jobs/EmployerDashboardPage";
import CompanyDetailsPage from "./pages/jobs/CompanyDetailsPage";
import JobHistoryPage from "./pages/jobs/JobHistoryPage";
import TrainingOffersPage from "./pages/jobs/TrainingOffersPage";
import JobAlertsSettingsPage from "./pages/jobs/JobAlertsSettingsPage";

import ProfilePage from "./pages/profile/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AdminDashboard from "./modules/admin/AdminDashboard";

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
            <Route path="community/post/:id" element={<PostDetailPage />} />
            <Route path="community/map" element={<CommunityMap />} />
            <Route path="community/events" element={<EventsPage />} />
            <Route path="community/friends" element={<FriendsPage />} />
            <Route path="community/friends/requests" element={<FriendRequestsPage />} />
            <Route path="community/friends/suggestions" element={<SuggestedFriendsPage />} />
            <Route path="community/groups" element={<GroupsPage />} />
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

            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
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

