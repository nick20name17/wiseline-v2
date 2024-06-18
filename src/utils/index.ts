export const getUpperCaseInitials = (fullName: string): string => {
    const nameParts = fullName.split(' ')

    if (nameParts.length < 2) {
        throw new Error('Full name must include at least a first name and a last name.')
    }

    const firstNameInitial = nameParts[0].charAt(0).toUpperCase()
    const lastNameInitial = nameParts[1].charAt(0).toUpperCase()

    return `${firstNameInitial}${lastNameInitial}`
}

export const trunc = (text: string, maxLenght: number) =>
    text?.length > maxLenght ? text?.substring(0, maxLenght - 3) + '...' : text

export const capitalize = (string: string) =>
    string?.replace(/\b\w/g, (char) => char?.toUpperCase())

export const getQueryParamString = <T>(params: T) => {
    const searchParams = new URLSearchParams()

    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            searchParams.append(key, params[key]!.toString())
        }
    }

    return searchParams.toString()
}

export const convertTimeToReadableFormat = (timeString: string): string => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)

    const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60)

    const readableHours = Math.floor(totalMinutes / 60)
    const readableMinutes = totalMinutes % 60

    const hoursPart = readableHours > 0 ? `${readableHours}h` : ''
    const minutesPart = readableMinutes > 0 ? `${readableMinutes} min` : ''

    return `${hoursPart} ${minutesPart}`.trim()
}

export const areDatesEqual = (date1: Date, date2: Date) => {
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return false
    }

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

export const getWeekRange = () => {
    const today = new Date()

    const startOfWeek = new Date(today)
    startOfWeek.setDate(startOfWeek.getDate() - ((today.getDay() + 6) % 7))
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const lastWeekStart = new Date(startOfWeek)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekEnd = new Date(lastWeekStart)
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6)

    const nextWeekStart = new Date(endOfWeek)
    nextWeekStart.setDate(nextWeekStart.getDate() + 1)
    const nextWeekEnd = new Date(nextWeekStart)
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6)

    return {
        lastWeek: { start: lastWeekStart, end: lastWeekEnd },
        thisWeek: { start: startOfWeek, end: endOfWeek },
        nextWeek: { start: nextWeekStart, end: nextWeekEnd }
    }
}

export const sumTimes = (times: string[]) => {
    let totalSeconds = 0

    times.forEach((time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number)
        totalSeconds += hours * 3600 + minutes * 60 + seconds
    })

    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)

    return `${hours}h ${minutes}min`
}
