import {
    Asterisk,
    Calendar,
    CircleUserRound,
    Cog,
    Gauge,
    Menu,
    MenuSquare,
    Package2,
    PackageIcon,
    Truck
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../../ui/sheet'

import logo from '@/assets/images/logo.svg'
import {
    Command,
    CommandItem,
    CommandList,
    CommandShortcut
} from '@/components/ui/command'
import { routes } from '@/config/routes'
import { cn } from '@/lib/utils'

const navigationItems = [
    {
        icon: MenuSquare,
        label: 'Orders',
        link: '/'
    },
    {
        icon: Cog,
        label: 'Flow Settings',
        link: routes.flowSettings
    },
    {
        icon: CircleUserRound,
        label: 'Users',
        link: routes.users
    },
    {
        icon: Calendar,
        label: 'Calendar',
        link: routes.calendar
    },
    {
        icon: Asterisk,
        label: 'Priorities',
        link: routes.priorities
    },
    {
        icon: Gauge,
        label: 'Dashboard',
        link: '/',
        badge: 'Soon'
    },
    {
        icon: PackageIcon,
        label: 'Packaging',
        link: '/',
        badge: 'Soon'
    },
    {
        icon: Package2,
        label: 'Dispatch',
        link: '/',
        badge: 'Soon'
    },
    {
        icon: Truck,
        label: 'Delivery',
        link: '/',
        badge: 'Soon'
    }
]

export const SideBar = () => {
    return (
        <Sheet>
            <SheetTrigger className='rounded-md bg-secondary p-2'>
                <Menu />
            </SheetTrigger>
            <SheetContent
                className='w-[300px]'
                side='left'>
                <SheetHeader>
                    <Link to={routes.orders}>
                        <SheetTitle className='flex items-center gap-x-3 uppercase'>
                            <img
                                src={logo}
                                alt='Wiseline'
                            />
                            Wiseline
                        </SheetTitle>
                    </Link>
                </SheetHeader>
                <Separator className='my-4' />
                <Command>
                    <CommandList className='max-h-fit'>
                        {navigationItems.map((item) => (
                            <Link
                                to={item.link}
                                key={item.label}
                                className={cn(
                                    !!item.badge &&
                                        'pointer-events-none text-muted-foreground'
                                )}>
                                <CommandItem className='mt-2 cursor-pointer'>
                                    {React.createElement(item.icon, {
                                        className: 'mr-2 w-4 h-4'
                                    })}
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <CommandShortcut>
                                            <Badge
                                                variant='outline'
                                                className='pointer-events-none font-normal tracking-normal'>
                                                {item.badge}
                                            </Badge>
                                        </CommandShortcut>
                                    )}
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}
