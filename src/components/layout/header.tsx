import { ModeToggle, SearchBar } from '../shared'

export const Header = () => {
    return (
        <header className='flex items-center justify-between border-b border-b-primary p-4'>
            <span>Header</span>
            <SearchBar />
            <ModeToggle />
        </header>
    )
}
