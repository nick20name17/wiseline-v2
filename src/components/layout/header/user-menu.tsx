import { LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ModeToggle } from '../../shared'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { routes } from '@/config/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks/hooks'
import { logout, selectUser } from '@/store/slices/auth'
import { getUpperCaseInitials } from '@/utils'

export const UserMenu = () => {
    const currentUser = useAppSelector(selectUser)
    const dispatch = useAppDispatch()

    const avatarFallback = getUpperCaseInitials(
        currentUser?.first_name! + ' ' + currentUser?.last_name!
    )

    const handleLogOut = () => dispatch(logout())

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src='/' />
                    <AvatarFallback className='border border-foreground bg-secondary'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-2'>
                <DropdownMenuLabel
                    onClick={handleLogOut}
                    className='flex flex-col items-start font-normal'>
                    {/* <span>{`${currentUser?.first_name} ${currentUser?.last_name}`}</span> */}
                    <span>John Doe</span>
                    <span className='text-muted-foreground'>{currentUser?.email}</span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <Link to={routes.userSettings}>
                        <DropdownMenuItem>
                            <Settings className='mr-2 h-4 w-4' />
                            <span>User Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link to={routes.companySettings}>
                        <DropdownMenuItem>
                            <Settings className='mr-2 h-4 w-4' />
                            <span>Company settings</span>
                        </DropdownMenuItem>
                    </Link>
                    <ModeToggle />
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogOut}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
