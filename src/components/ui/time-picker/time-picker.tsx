import { forwardRef } from 'react'
import type { TimeValue } from 'react-aria'
import { type TimeFieldStateOptions } from 'react-stately'

import { TimeField } from './time-field'

interface TimePickerProps extends Omit<TimeFieldStateOptions<TimeValue>, 'locale'> {
    time: TimeValue | null
}

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((props, _) => {
    return (
        <TimeField
            onChange={props.onChange}
            value={props.time}
            granularity='minute'
            hourCycle={12}
            {...props}
        />
    )
})

TimePicker.displayName = 'TimePicker'

export { TimePicker }
