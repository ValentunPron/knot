import Image from 'next/image';
import Link from "next/link";

import logo from '@/assets/logo.svg';
import logout from '@/assets/logout.svg'
import person from '@/assets/person.svg';
import { OrganizationSwitcher  , SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

function Topbar() {
    return (
        <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src={logo} alt='logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Knot</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    <SignedIn>
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                                <Image src={logout} alt='logout' width={24} height={24}/>
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                <SignedOut>
                    <Link href="sing-in" className='flex items-center gap-3 cursor-pointer'>
                        <span className='text-sm font-bold text-light-1'>Увійти</span>
                        <Image src={person} alt='person' width={28} height={28}/>
                    </Link>
                </SignedOut>
                
                <OrganizationSwitcher   
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: 'py-4 px-2'
                        }
                    }}
                />
            </div>
        </nav>
    )
}

export default Topbar;