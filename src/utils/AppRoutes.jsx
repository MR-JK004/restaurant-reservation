import MainPage from '../components/MainPage';
import Login from '../components/Login';
import Register from '../components/Register';
import TopBar from '../components/TopBar';
import Restaurants from '../components/Restaurants';
import BookingRestaurant from '../components/BookingRestaurant';
import AddRestaurant from '../components/AddRestaurant';
import ProtectedRoute from './ProtectedRoute';
import AdminGuard from './AdminGuard';
import ReservationHistory from '../components/ReservationHistory';
import BookingModifyPage from '../components/BookingModifyPage';
import ReviewsPage from '../components/ReviewsPage';
import Preferences from '../components/Preferences.';

const AppRoutes = [
    {
        path: '/',
        element: (
            <>
                <TopBar />
                <MainPage />
            </>
        ),
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/restaurants',
        element: (
            <>
                <TopBar />
                <Restaurants />
            </>
        ),
    },
    {
        path: '/restaurant/:id',
        element: (
            <>
                <TopBar />
                <BookingRestaurant />
            </>
        ),
    },
    {
        path: '/add-restaurant',
        element: (
            <>
                <TopBar />
                <AdminGuard>
                    <AddRestaurant />
                </AdminGuard>
            </>
        )
    },
    {
        path: '/reservation-history',
        element: (
            <>
                <TopBar />
                <ProtectedRoute>
                    <ReservationHistory />
                </ProtectedRoute>
            </>
        )
    },
    {
        path: '/booking-modify/:id',
        element: (
            <>
                <TopBar />
                <ProtectedRoute>
                    <BookingModifyPage/>
                </ProtectedRoute>
            </>
        )
    },
    {
        path: '/reviews/:id',
        element: (
            <>
                <TopBar />
                <AdminGuard>
                    <ReviewsPage/>
                </AdminGuard>
            </>
        )
    },
    {
        path: '/preferences',
        element: (
            <>
                <TopBar />
                <ProtectedRoute>
                    <Preferences/>
                </ProtectedRoute>
            </>
        )
    }
];

export default AppRoutes;   