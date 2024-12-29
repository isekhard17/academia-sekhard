import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DashboardLayout } from '../../../components/layouts/dashboard-layout';
import { UsersList } from '../../../components/admin/users/users-list';
import { CreateUserDialog } from '../../../components/admin/users/create-user-dialog';
import { EditUserDialog } from '../../../components/admin/users/edit-user-dialog';
import { adminApi } from '../../../services/api';
import type { Usuario } from '../../../types/users';

export function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsuarios();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCreated = () => {
    loadUsers();
    setShowCreateDialog(false);
  };

  const handleUserUpdated = async () => {
    await loadUsers();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        <UsersList
          users={users}
          isLoading={isLoading}
          onCreateUser={() => setShowCreateDialog(true)}
          onEditUser={setEditingUser}
          onUserUpdated={handleUserUpdated}
        />

        <CreateUserDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleUserCreated}
        />

        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={handleUserUpdated}
        />
      </div>
    </DashboardLayout>
  );
}