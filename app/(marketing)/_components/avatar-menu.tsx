import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

// INTERFACES
import { IRequestUser } from '@/interfaces/request-user.interface';

// COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AvatarMenuProps {
	user: IRequestUser | null;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ user }) => {
	const src =
		user?.picture || 'https://avatars.githubusercontent.com/u/39416183?v=4';
	const fallback = user ? `${user?.firstName[0]}${user?.lastName[0]}` : 'JD';
	const alt = user ? `${user.firstName} Picture` : 'John Picture';

	return (
		<div className="w-10 h-10 rounded-full border">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className="w-full h-full">
						<AvatarImage src={src} alt={alt} />
						<AvatarFallback>{fallback}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="mr-2 p-4">
					<DropdownMenuLabel className="flex gap-4">
						<Avatar className="w-12 h-12 border">
							<AvatarImage src={src} alt={alt} />
							<AvatarFallback>{fallback}</AvatarFallback>
						</Avatar>

						<div className="flex flex-col">
							<span className="">{user?.firstName}</span>
							<span className="text-xs text-gray-400">
								{user?.email}
							</span>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="hover:cursor-pointer">
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem
						className="hover:cursor-pointer"
						onClick={() => signOut()}
					>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export { AvatarMenu };
