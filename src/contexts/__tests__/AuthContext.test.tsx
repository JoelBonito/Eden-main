import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auth, db } from '../../services/firebase';

// Componente simples para testar o hook useAuth
const TestComponent = () => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return <div data-testid="loading">Loading...</div>;
    return (
        <div>
            <div data-testid="user">{user?.email || 'No User'}</div>
            <div data-testid="role">{isAdmin ? 'Admin' : 'User'}</div>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading state initially', async () => {
        vi.mocked(auth.onAuthStateChanged).mockReturnValue(() => { });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should load user data from firestore when authenticated', async () => {
        const mockAuthUser = {
            uid: '123',
            email: 'test@eden.com',
            getIdToken: vi.fn().mockResolvedValue('token')
        };
        const mockUserData = { email: 'test@eden.com', role: 'admin', name: 'Test User' };

        // Mock onAuthStateChanged callback
        vi.mocked(auth.onAuthStateChanged).mockImplementation(((callback: (user: unknown) => void) => {
            callback(mockAuthUser);
            return () => { };
        }) as unknown as typeof auth.onAuthStateChanged);

        // Mock Firestore
        const mockDoc = { exists: true, data: () => mockUserData };
        vi.mocked(db.collection).mockReturnValue({
            doc: vi.fn().mockReturnValue({
                get: vi.fn().mockResolvedValue(mockDoc),
            }),
        } as unknown as ReturnType<typeof db.collection>);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // No test environments, the 1s delay is skipped.
        // We just wait for the subsequent async state updates.
        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('user')).toHaveTextContent('test@eden.com');
        expect(screen.getByTestId('role')).toHaveTextContent('Admin');
    });

    it('should set user to null when not authenticated', async () => {
        vi.mocked(auth.onAuthStateChanged).mockImplementation(((callback: (user: unknown) => void) => {
            callback(null);
            return () => { };
        }) as unknown as typeof auth.onAuthStateChanged);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
});
