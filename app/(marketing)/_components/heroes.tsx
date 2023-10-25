import { memo } from 'react';
import Image from 'next/image';

const Heroes: React.FC = memo(() => {
	return (
		<div className="flex flex-col items-center justify-center max-w-5xl">
			<div className="flex items-center">
				<div className="relative w-[300px] h-[300px] sm:w-[350px]">
					<Image
						src="/documents.png"
						fill
						priority
						quality={80}
						alt="Documents"
						className="object-contain dark:hidden"
					/>

					<Image
						src="/documents-dark.png"
						fill
						priority
						quality={80}
						alt="Documents"
						className="object-contain hidden dark:block"
					/>
				</div>

				<div className="relative w-[400px] h-[400px] hidden md:block">
					<Image
						src="/reading.png"
						fill
						priority
						quality={80}
						alt="Reading"
						className="object-contain dark:hidden"
					/>

					<Image
						src="/reading-dark.png"
						fill
						priority
						quality={80}
						alt="Reading"
						className="object-contain hidden dark:block"
					/>
				</div>
			</div>
		</div>
	);
});

Heroes.displayName = 'Heroes';

export { Heroes };
