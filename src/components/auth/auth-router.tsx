import { useAuth } from '../../contexts/auth.context';
import { AppRoutes } from '../../routes';
import { LoadingScreen } from '../ui/loading-screen';

export function AuthRouter() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppRoutes />;
}