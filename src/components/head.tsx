import Helmet from 'react-helmet'

import { usePageName } from '@/hooks'

interface HeadProps {
    description?: string
}

export const Head: React.FC<HeadProps> = ({ description = 'some description' }) => {
    const pageName = usePageName()

    return (
        <Helmet>
            <meta charSet='utf-8' />
            <title>{pageName}</title>
            <meta
                name='description'
                content={description}
            />
            <meta
                name='viewport'
                content='width=device-width, initial-scale=1.0'
            />
        </Helmet>
    )
}
