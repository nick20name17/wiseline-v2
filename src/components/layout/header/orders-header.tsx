import { SideBar } from './sidebar'
import { UserMenu } from './user-menu'
import { Filters } from '@/components/modules/orders/controls/filters'
import { ProductionCategories } from '@/components/modules/orders/controls/production-categorie'
import { WeekFilters } from '@/components/modules/orders/controls/week-filters'

export const OrdersHeader = () => {
    return (
        <header className='relative'>
            <div className='flex h-20 items-center justify-between gap-6'>
                <div className='flex items-center gap-x-6 py-5'>
                    <div className='flex items-center gap-x-2'>
                        <SideBar />
                    </div>

                    <ProductionCategories />
                </div>
                <UserMenu />
            </div>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-4'>
                <Filters />
                <WeekFilters />
            </div>
        </header>
    )
}
