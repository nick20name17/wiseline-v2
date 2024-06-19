import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

import {
    useAddCompanyProfilesMutation,
    useGetCompanyProfilesQuery
} from '@/store/api/profiles/profiles'
import type { CompanyProfileData } from '@/store/api/profiles/profiles.types'
import { isErrorWithMessage } from '@/utils'

export const CompanySettings = () => {
    const { data } = useGetCompanyProfilesQuery()

    const [checked, setChecked] = useState(data?.working_weekend)

    const [addCompanyProfiles] = useAddCompanyProfilesMutation()

    const errorToast = (description: string) =>
        toast.error('Change Password', { description })

    const handleAddCompanyProfiles = async (data: CompanyProfileData) => {
        try {
            addCompanyProfiles(data).unwrap()
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    const onCheckedChange = (checked: boolean) => {
        setChecked(checked)
        handleAddCompanyProfiles({ working_weekend: checked })
    }

    useEffect(() => {
        setChecked(data?.working_weekend)
    }, [data?.working_weekend])

    return (
        <section className='mx-auto mt-5 max-w-[1120px] px-3'>
            <div className='mx-auto mt-10 flex w-64 items-center justify-between gap-x-4 rounded-md border bg-muted/40 p-4'>
                <Label htmlFor='working_weekend'>Working weekend</Label>
                <Switch
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    id='working_weekend'
                />
            </div>
        </section>
    )
}
