import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.post(route('logout'));
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
          <UserInfo user={user} showEmail />
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        asChild
        className="text-gray-300 focus:text-gray-100"
      >
        <Link
          href={route('logout')}
          method="post"
          as="button"
          onClick={handleLogout}
          className="flex items-center w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
}
