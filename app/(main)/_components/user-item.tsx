'use client';

import { signOut, useSession } from 'next-auth/react';
import { ChevronsLeftRight } from 'lucide-react';

// COMPONENTS
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const UserItem: React.FC = () => {
	const { data: session } = useSession();

	const src =
		session?.user?.picture ||
		'https://avatars.githubusercontent.com/u/39416183?v=4';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					role="button"
					className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
				>
					<div className="gap-x-2 flex items-center max-w-[170px]">
						<Avatar className="h-7 w-7 border">
							<AvatarImage src={src} />
						</Avatar>

						<span className="text-start font-medium line-clamp-1">
							{session?.user.firstName}&apos;s Notion
						</span>
					</div>

					<ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground w-5 h-5" />
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-80"
				align="start"
				alignOffset={11}
				forceMount
			>
				<div className="flex flex-col space-y-1 p-2">
					<p className="text-xs font-medium leading-none text-muted-foreground">
						{session?.user.email}
					</p>

					<div className="flex items-center gap-x-2">
						<div className="rounded-md bg-secondary p-1">
							<Avatar className="w-8 h-8">
								<AvatarImage src={src} />
							</Avatar>
						</div>

						<div className="space-y-1">
							<p className="text-sm line-clamp-1">
								{session?.user.firstName}&apos;s Notion
							</p>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					asChild
					className="w-full cursor-pointer text-muted-foreground"
				>
					<Button variant="ghost" onClick={() => signOut()}>
						Log out
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { UserItem };
