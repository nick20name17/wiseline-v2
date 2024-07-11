import { toast } from 'sonner'

import { PasswordChange } from './password-change'
import { UserSettingsForms } from './user-settings-forms'
import { Button } from '@/components/ui/button'
import { useRemoveUserProfilesMutation } from '@/store/api/profiles/profiles'
import { isErrorWithMessage } from '@/utils'

export const UserSettings = () => {
    const [removeUserProfiles, { isLoading }] = useRemoveUserProfilesMutation()

    const successToast = () =>
        toast.success(`Account settings`, {
            description: 'Column settings reset successfully'
        })

    const errorToast = (error: string) => {
        toast.error(`Account settings`, {
            description: error
        })
    }

    const handleRemoveUserProfiles = async () => {
        try {
            await removeUserProfiles().unwrap().then(successToast)
        } catch (error) {
            const isErrorMessage = isErrorWithMessage(error)
            errorToast(isErrorMessage ? error.data.detail : 'Something went wrong')
        }
    }

    return (
        <section className='mx-auto mt-10 max-w-[1120px] p-4 px-3'>
            <div className='mt-5 flex flex-wrap gap-5'>
                <UserSettingsForms />
                <PasswordChange />
            </div>
            <div className='mt-10'>
                <h2 className='text-xl font-semibold text-secondary-foreground'>
                    Accounts settings
                </h2>

                <div className='mt-5'>
                    <Button
                        disabled={isLoading}
                        onClick={handleRemoveUserProfiles}
                        variant='outline'>
                        Reset columns settings
                    </Button>
                </div>
            </div>
        </section>
    )
}
