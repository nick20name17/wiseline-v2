import { toast } from 'sonner'

import { PasswordChange } from './password-change'
import { UserSettingsForms } from './user-settings-forms'
import { Button } from '@/components/ui/button'
import { useRemoveUserProfilesMutation } from '@/store/api/profiles/profiles'

export const UserSettings = () => {
    const [removeUserProfiles] = useRemoveUserProfilesMutation()

    const successToast = () =>
        toast.success(`Account settings`, {
            description: 'Column settings reset successfully'
        })

    const handleRemoveUserProfiles = async () => {
        try {
            await removeUserProfiles().unwrap().then(successToast)
        } catch {}
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
                        onClick={handleRemoveUserProfiles}
                        variant='outline'>
                        Reset columns settings
                    </Button>
                </div>
            </div>
        </section>
    )
}
